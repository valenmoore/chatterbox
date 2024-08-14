import { FC, useState, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import Input from './Input'
import translate from "translate";
/*import LanguageDetect from 'languagedetect';
const lngDetector = new LanguageDetect();*/
import { useLocation, useNavigate } from 'react-router-dom';
import { languageMap } from '../../constants/constants'
import { getAiResponse } from '../../utils/chatFunctions';

const Chat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = location.state;
    useEffect(() => {
        if (!params || !isValidParameters(params)) {
          navigate("/dashboard");
        }
    }, [navigate]);
    /*useEffect(() => {
        setConversationHistory([
            {
                role: "user",
                parts: [{ text: `Ask me questions about my life, interests, hobbies, and actions. Don't offer too much information about yourself, just ask me open-ended questions.` }],
                isCounted: false
            },
            {
                role: "model",
                parts: [{ text: `Got it. I'll ask open-ended questions.` }],
                isCounted: false
            }
        ]);
    }, []);*/
    const [messages, setMessages] = useState([]);
    const [conversationHistory, setConversationHistory] = useState([]);
    const translateText = async (from, to, text) => {
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
        const key = "AIzaSyDDUJ-ottb6mDzb2Ce2PNgIuh1DBD02aFc"
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
        sound.play();
    }

    /*const detectLanguage = async (text): Promise<string> => {
        const detect = lngDetector.detect(text, 2)
        return detect[0][0];
    }*/

    const handleSendPrompt = async (prompt, isDummy=false) => {
        if (messages.length > 0 && messages[messages.length - 1].role === "user") return
        setMessages(prevMessages => [...prevMessages, {role: "user", content: prompt, isDummy}]);
        console.log(conversationHistory)
        let finalResponse;
        isDummy = false;
        let translatedPrompt;
        let isCounted;
        try {
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

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((message, index) => {
                    if (!message.isDummy) {
                        return (
                            <ChatBubble key={index} message={message.content} language={language} translateFunction={translateText} isUser={message.role === "user"} />
                        );
                    }
                    return null;
                })}
            </div>
            <Input handlePrompt={handleSendPrompt} language={language} />
        </div>
    );
};

export default Chat;