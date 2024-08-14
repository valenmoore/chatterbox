import { FC, useState } from 'react';

const ChatBubble = ({ message, isUser, onGradeResponse }) => {
    const [feedbackShown, setFeedbackShown] = useState(false);
    const handleGradeResponse = () => {
        if (isUser) {
            setFeedbackShown(true);
            onGradeResponse(message);
        }
    };

    return (
        <div className={`chat-bubble ${isUser ? 'user' : 'model'} ${feedbackShown ? 'feedback-shown' : ""}`}>
            <div className={`bubble ${isUser ? 'user' : 'model'} exam-bubble`}>
                <div></div>
                <p>{message}</p>
                {isUser && (
                    <div><button onClick={handleGradeResponse} disabled={feedbackShown}>Show Feedback</button></div>
                )}
            </div>
        </div>
    );
};

export default ChatBubble;