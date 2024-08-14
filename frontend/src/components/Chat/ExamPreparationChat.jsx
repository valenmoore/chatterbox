import { FC, useState, useEffect } from 'react';
import Input from './Input'
import translate from "translate";
/*import LanguageDetect from 'languagedetect';
const lngDetector = new LanguageDetect();*/
import { useLocation, useNavigate } from 'react-router-dom';
import { languageMap, examQuestions } from '../../constants/constants'
import { gradeExamResponse } from '../../utils/chatFunctions';
import ResponseFeedback from './ResponseFeedback';
import ExamChatBubble from './ExamChatBubble';

const ExamPreparationChat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = location.state;
    useEffect(() => {
        if (!params) {
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
    const [usedIndices, setUsedIndices] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const gradePreviousResponse = async (question, response) => {
        const grade = await gradeExamResponse(question, response);
        return grade;
    }
    const handleGradeResponse = async (message) => {
        // Simulate grading the response
        setIsLoading(true);
        const gradedFeedback = await gradePreviousResponse(conversationHistory[conversationHistory.length - 2].parts[0].text, message);
        setIsLoading(false);
        setFeedback(gradedFeedback);
    };
    const translateText = async (from, to, text) => {
        const result = await translate(text, { to, from });
        return result;
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

    function getRandomNumber(min, max) {
        var index;
        do {
          index = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (usedIndices.includes(index));
        
        return index;
    }


    /*useEffect(() => {
        // This effect runs whenever conversationHistory changes
        if (conversationHistory.length < 2) return; // Wait until there are at least two messages in history
    
        const question = conversationHistory[conversationHistory.length - 2].parts[0].text;
        const response = conversationHistory[conversationHistory.length - 1].parts[0].text;
        
        // Call gradePreviousResponse with the question and response
        gradePreviousResponse(question, response);
    }, [conversationHistory])*/

    const handleSendPrompt = async (prompt, isDummy=false) => {
        if (messages.length > 0 && messages[messages.length - 1].role === "user") return
        setMessages(prevMessages => [...prevMessages, {role: "user", content: prompt, isDummy}]);
        // Update conversation history state and wait for the update to complete
        setConversationHistory((prevHistory) => [...prevHistory, {role: "user", parts: [{ text: prompt }], isCounted: true}]);
    };

    const getQuestion = async () => {
        setMessages([])
        setFeedback('');
        const index = getRandomNumber(0, examQuestions.length - 1);
        console.log(index);
        setUsedIndices(prev => [...prev, index]);
        const response = (await translateText("en", language.abrev, examQuestions[index])).replace("<ctrl100>", "");;
        setMessages(prevMessages => [...prevMessages, {role: "model", content: response, isDummy: false}]);
        setConversationHistory(prev => [...prev, {role: "model", parts: [{ text: response }], isCounted: true}])
        const audio = await tts(response);
        playAudio(audio);
    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((message, index) => {
                    if (!message.isDummy) {
                        return (
                            <ExamChatBubble
                                key={index}
                                message={message.content}
                                isUser={message.role === "user"}
                                onGradeResponse={handleGradeResponse}
                            />
                        );
                    }
                    return null;
                })}
            {isLoading && <div className='response-feedback'>Loading...</div>}
            {!isLoading && feedback && <ResponseFeedback feedback={feedback} />}        </div>
            <div className='button-bar'>
                <button onClick={getQuestion} disabled={conversationHistory[conversationHistory.length - 1]?.role === "model"}>Generate question</button>
                <Input inputStyle={{display: conversationHistory[conversationHistory.length - 1]?.role === "model" ? "flex" : "none"}} handlePrompt={handleSendPrompt} language={language} />
            </div>
        </div>
    );
};

export default ExamPreparationChat;