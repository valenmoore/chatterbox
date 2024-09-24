import { useState } from "react";
import Input from "./Input";

const UserChatBubble = ({ message, handlePrompt, language, isAudioPlaying }) => {
    const [parentHeight, setParentHeight] = useState('auto');
    return (
        <div className="chat-bubble">
            <Input handlePrompt={handlePrompt} language={language} isAudioPlaying={isAudioPlaying} setParentHeight={setParentHeight} />
        </div>
    )
}

export default UserChatBubble;