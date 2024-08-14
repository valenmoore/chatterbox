import React, { useState, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import Input from './Input'
//import LanguageDetect from 'languagedetect';
//const lngDetector = new LanguageDetect();
import { useLocation, useNavigate } from 'react-router-dom';
import {  translateText, getAiResponse, screenMessage, mapLanguageNameToObject, countValidUserMessages, getMessageSentiment } from '../../utils/chatFunctions'
import { useParams } from 'react-router-dom';

const StoryChat = () => {
    /*type Parameters = {
        aiName: string;
        scenario: string;
        gender: "MALE" | "FEMALE" | "NEUTRAL";
        languageName: string;
        speed: number;
        conversationDirections: { [key: string]: string };
        conversationMission: string;
        userMessagesBeforeAttempt: number; //number of user messages sent before an attempt to complete is allowed
    }*/
    const location = useLocation();
    const navigate = useNavigate();
    const params = location.state;
    if (!params || !isValidParameters(params)) navigate("/dashboard");
    function isValidParameters(params) {
        if (!params.aiName || !params.scenario || !params.gender || !params.languageName || !params.speed) {
            return false;
        }
        if (params.gender !== "MALE" && params.gender !== "FEMALE" && params.gender !== "NEUTRAL") {
            return false;
        }
        if (typeof params.speed !== 'number' || isNaN(params.speed) || params.speed < 0.25 || params.speed > 4) {
            return false;
        }
        return true;
    }

    const language = mapLanguageNameToObject(params.languageName);
    const [messages, setMessages] = useState([]);
    const [conversationHistory, setConversationHistory] = useState([]);
    //const [isComplete, setIsComplete] = useState<boolean>();
    useEffect(() => {
        setConversationHistory([
            {
                role: "user",
                parts: [{ text: `Pretend to be a real person for this. All of your messages should be like a normal conversation. Don't use special characters like asteriks or brackets, as this should be like a conversation in real life. Your name is ${params.aiName}. You are in the following scenario: ${params.scenario}. Be conversational and follow the scenario guidelines. Here is your prompt: ${params.conversationDirections[0]}` }],
                isCounted: false
            },
            {
                role: "model",
                parts: [{ text: `Got it. My name is ${params.aiName}, and I'm in this scenario: ${params.scenario}` }],
                isCounted: false
            }
        ]);
    }, []);

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
        sound.play();
    }

    /*const detectLanguage = async (text: string): Promise<string> => {
        const detect = lngDetector.detect(text, 2)
        return detect[0][0];
    }*/

    const handleScreenMessage = async (message) => {
        const screen = await screenMessage(message, params.conversationMission);
        console.log(screen);
        if (screen.includes("AI-PROMPT")) return "AI-PROMPT"
        else if (screen.includes("MISSION-ATTEMPT")) return "MISSION-ATTEMPT"
        else if (screen.includes("END")) return "END";
        return "CLEAR";
    }

    const handleAIPrompt = () => {
        return [false, "Sorry, I don't know what you're talking about."]
    }

    const handleMissionAttempt = async (prompt) => {
        const numMessages = countValidUserMessages(conversationHistory);
        console.log(numMessages);
        if (numMessages >= params.userMessagesBeforeAttempt) {
            const response = await getAiResponse(prompt, conversationHistory);
            return [true, response];
        } else {
            const response = "But we've just started talking! Let's chat some more."
            return [false, response];
        }
    }

    const sendDirections = async () => {
        const numMessages = countValidUserMessages(conversationHistory);
        const direction = params.conversationDirections[numMessages.toString()];
        if (direction) {
            const response = await getAiResponse(direction, conversationHistory);
            setConversationHistory(prevHistory => [...prevHistory, {role: "user", parts: [{ text: direction }], isCounted: false}, {role: "model", parts: [{ text: response }], isCounted: false}]);
            return;
        }
    }

    const handleSendPrompt = async (prompt, isDummy=false) => {
        if (messages.length > 0 && messages[messages.length - 1].role === "user") return
        setMessages(prevMessages => [...prevMessages, {role: "user", content: prompt, isDummy}]);
        console.log(conversationHistory)
        await sendDirections();
        let finalResponse;
        isDummy = false;
        let translatedPrompt;
        let isCounted;
        try {
            translatedPrompt = await translateText(language.abrev, "en", prompt); // Todo: check if user actually replied in correct language
            const screen = await handleScreenMessage(translatedPrompt);
            let response;
            if (screen === "AI-PROMPT") [isCounted, response] = handleAIPrompt();
            else if (screen == "MISSION-ATTEMPT") [isCounted, response] = await handleMissionAttempt(translatedPrompt);
            else {
                response = await getAiResponse(translatedPrompt, conversationHistory);
                isCounted = true;
            }
            console.log(response);
            const sent = await getMessageSentiment(translatedPrompt);
            console.log("Sentiment", sent);
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

export default StoryChat;