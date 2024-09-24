import { useEffect, useState } from "react";
import UserChatBubble from "./UserChatBubble";
import Avatar from "../Avatar/Avatar";

const ChatWindow = ({ messages }) => {
    const [userMessage, setUserMessage] = useState("");

    useEffect(() => {
        console.log(messages)
        if (messages[messages.length - 1]?.role === "user") setUserMessage(messages[messages.length - 1]?.content);
        else setUserMessage(messages[messages.length - 2]?.content);
    }, [messages])
    return (
        <>

            {/*messages.map((message, index) => {
                if (!message.isDummy) {
                    return (
                        <ChatBubble key={index} message={message.content} language={language} translateFunction={translateText} isUser={message.role === "user"} blurred={params.blurMessages} />
                    );
                }
                return null;
            })*/}
        </>
    )
}

export default ChatWindow;