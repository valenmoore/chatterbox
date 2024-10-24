import { FC, useState, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import Input from './Input';
import ChatWindow from './ChatWindow';
import Skyline from '../svgs/Skyline';
import UserChatBubble from './UserChatBubble';
import AIChatBubble from './AIChatBubble';
import Avatar from '../Avatar/Avatar';
import translate from "translate";
/*import LanguageDetect from 'languagedetect';
const lngDetector = new LanguageDetect();*/
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { languageMap } from '../../constants/constants'
import { getAiResponse, getAudioBuffer, getMessageWordsPerMinute, getWordsUniqueness, getMostCommonWords } from '../../utils/chatFunctions';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import useFirebaseAuth from '../../hooks/useAuth';

const Chat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = location.state;
    const { index } = useParams();
    const userProfile = useFirebaseAuth();

    useEffect(() => {
        if (!params || !isValidParameters(params)) {
          navigate("/dashboard");
        }
    }, [navigate]);
    useEffect(() => {
        setConversationHistory([
            {
                role: "user",
                parts: [{ text: `Be very conversational and pretend like you are a real person. Do not mention that you are AI or a computer, pretend to be a real person named ${params.aiName} in the following situation: ${params.scenario}. Be conversational.` }],
                isCounted: false
            },
            {
                role: "model",
                parts: [{ text: `Got it. My name is ${params.aiName} and I am in this scenario: ${params.scenario}. I will be conversational and pretend I am a real person, not an AI model.` }],
                isCounted: false
            }
        ]);
    }, []);
    const [messages, setMessages] = useState([]);
    const [conversationStats, setConversationStats] = useState({translations: {}, wordUniqueness: null, mostCommonWords: [], messageStats: []});
    const [conversationHistory, setConversationHistory] = useState([]);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [aiMessage, setAiMessage] = useState(null);

    const translateText = async (from, to, text) => {
        console.log(from, to, text)
        const result = await translate(text, { to, from });
        return result;
    }

    function isValidParameters(params) {
        // Check if all required properties are present
        if (!params.aiName || !params.scenario || !params.gender || !params.languageName || !params.speed) {
            return false;
        }
        
        // Check if gender is one of the allowed values
        if (params.gender !== "MALE" && params.gender !== "FEMALE" && params.gender !== "NEUTRAL") {
            return false;
        }
    
        // Check if speed is a valid number
        if (typeof params.speed !== 'number' || isNaN(params.speed) || params.speed < 0.25 || params.speed > 4) {
            return false;
        }
    
        // Additional custom validations can be added here for other properties
    
        // If all validations pass, return true
        return true;
    }

    const mapLanguageNameToObject = (languageName) => {
        // Convert language name to lowercase for case-insensitive comparison
        const lowerCaseLanguageName = languageName.toLowerCase();
        
        // Check if the provided language name exists in the map
        if (languageMap.hasOwnProperty(lowerCaseLanguageName)) {
            return languageMap[lowerCaseLanguageName];
        } else {
            // Return a default object or handle the case when the language name is not found
            return null;
        }
    };
    const language = mapLanguageNameToObject(params.languageName)

    // const language = { full: "french", abrev: "fr", bcp: "fr-FR" };
    const tts = async (text) => {
        const key = import.meta.env.VITE_TTS_KEY
        const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${key}`
        const payload = {
            "audioConfig": {
              "audioEncoding": "MP3",
              "effectsProfileId": [
                "headphone-class-device"
              ],
              "pitch": 0,
              "speakingRate": params.speed
            },
            "input": {
              "text": text
            },
            "voice": {
              "languageCode": language.bcp,
              "ssmlGender": params.gender
            }
        }
        const response = await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        return await response.json()
    }

    const playAudio = (audio) => {
        const sound = new Audio(`data:audio/mp3;base64,${audio.audioContent}`);
        // When the audio starts playing, set the state to true
        sound.onplay = () => setIsAudioPlaying(true);

        // When the audio ends, set the state to false
        sound.onended = () => setIsAudioPlaying(false);
        sound.play();
    }

    /*const detectLanguage = async (text): Promise<string> => {
        const detect = lngDetector.detect(text, 2)
        return detect[0][0];
    }*/

    const handleMessageStat = async (prompt, audio) => {
        const buffer = await getAudioBuffer(audio);
        const wpm = getMessageWordsPerMinute(buffer, prompt);
        // const silence = analyzeSilence(buffer);
        const messageStat = { text: prompt,audio: JSON.stringify(audio), wpm };
        const prevStats = conversationStats.messageStats;
        prevStats.push(messageStat);
        setConversationStats({...conversationStats, messageStats: prevStats});
    }

    const handleSendPrompt = async (prompt, audio, isDummy=false) => {
        if (messages.length > 0 && messages[messages.length - 1].role === "user") return
        setMessages(prevMessages => [...prevMessages, {role: "user", content: prompt, isDummy}]);

        handleMessageStat(prompt, audio);

        let finalResponse;
        isDummy = false;
        let translatedPrompt;
        let isCounted;
        try {
            console.log(language.abrev, "en", prompt);
            translatedPrompt = await translateText(language.abrev, "en", prompt); // Todo: check if user actually replied in correct language
            let response = await getAiResponse(translatedPrompt, conversationHistory);
            isCounted = true;
            // Todo: possibly change the "en" part of the translate text to a detected language
            if (response === "") {
                throw new Error("failed to generate response")
            }
            finalResponse = (await translateText("en", language.abrev, response)).replace("<ctrl100>", "");
        } catch (error) {
            console.log("error: ", error);
            finalResponse = await translateText("en", language.abrev, "I am sorry, I do not understand.")
        }
        setMessages(prevMessages => [...prevMessages, {role: "model", content: finalResponse, isDummy}]);
        setConversationHistory(prevHistory => [...prevHistory, {role: "user", parts: [{ text: translatedPrompt }], isCounted}, {role: "model", parts: [{ text: finalResponse }], isCounted: true}]);
        if (!isDummy) {
            const audio = await tts(finalResponse);
            playAudio(audio);
        }
    };

    useEffect(() => {
        const userMessages = messages.map(m => m.role === "user" ? m.content : undefined).filter(m => m !== undefined);
        console.log(getMostCommonWords(userMessages))
        if (messages.length > 0) {
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].role === "model") {
                    console.log(messages[i].content)
                    setAiMessage(messages[i].content);
                    break;
                }
            }
        }
    }, [messages])

    const endConversation = async () => {
        const userMessages = messages.map(m => m.role === "user" ? m.content : undefined).filter(m => m !== undefined);
        console.log(userMessages)
        const temp = [];
        for (const m of conversationStats.messageStats) {
            temp.push({wpm: m.wpm});
        }
        const docRef = doc(db, "users", userProfile.user?.uid);
        const docSnap = (await getDoc(docRef)).data();
        const conversationIndex = docSnap.saves[index].averages.wpms.length;
        const understandingIndex = docSnap.saves[index].averages.understandings.length;
        const mostCommonWordsIndex = Object.keys(docSnap.saves[index].mostCommonWords).length;
        setConversationStats({...conversationStats, speed: params.speed});
        navigate('/saves/' + index + '/chat-recap', { state: { userMessageStats: conversationStats, messages, messageStats: temp, wordUniqueness: getWordsUniqueness(userMessages), mostCommonWords: getMostCommonWords(userMessages), speed: params.speed, languageName: params.languageName, convoIndex: conversationIndex, understandingLength: understandingIndex, mostCommonWordsIndex } });
    }

    return (
        <div className="chat-container">
            <div className="chat-window">
                <div className="user-side">
                    <Avatar />
                    <UserChatBubble handlePrompt={handleSendPrompt} language={language} isAudioPlaying={isAudioPlaying} />
                </div>
                <div className="ai-side">
                    <Avatar />
                    <AIChatBubble message={aiMessage} language={language} translateFunction={translateText} conversationStats={conversationStats} setConversationStats={setConversationStats} blurred={params.blurred} />
                </div>
            </div>
            {/*<div className="input-container">
                <Input handlePrompt={handleSendPrompt} language={language} isAudioPlaying={isAudioPlaying} />
            </div>*/}
            <div onClick={endConversation} className="end-btn"><img src="/hand-waving.svg" /><div className='end-txt'>End conversation</div></div>
            <div className="background"><Skyline /><div className="color"></div></div>
        </div>
    );
};

export default Chat;