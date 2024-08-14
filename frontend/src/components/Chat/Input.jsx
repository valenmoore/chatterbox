import React, { useState, useEffect } from 'react';

const Input = ({ handlePrompt, language, inputStyle }) => {
    const [inputValue, setInputValue] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const [recognition] = useState(new SpeechRecognition());
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.lang = language.bcp;
    let currentText = "";

    recognition.addEventListener('result', (e) =>  {
        currentText = Array.from(e.results)
            .map((result) => result[0])
            .map(result => result.transcript)
            .join('');
        setInputValue(currentText);

        /*if (e.results[0].isFinal) {
            //p = document.createElement("p");
            console.log(currentText)
        }*/
    });
    recognition.addEventListener("end", () => console.log("end"))

    useEffect(() => {
        const input = document.querySelector("textarea");
        if (!input) return;
        input.style.height = 'inherit';
        input.style.height = `${input.scrollHeight}px`;
    }, [inputValue])

    const handleChange = (e) => {
        e.preventDefault();
        setInputValue(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      recognition.stop();
      setIsRecording(false);
      currentText = "";
      setInputValue(''); // Clear input after submission
      console.log(inputValue)
      handlePrompt(inputValue);
    };
    const startRecording = () => {
        if (isRecording) return
        recognition.start();
        setIsRecording(true);
    }
    const handleKey = (e) => {
        // Check if the pressed key is "Enter"
        if (e.key === 'Enter' && !e.shiftKey) {
          // Prevent the default behavior of the "Enter" key (inserting a new line)
          e.preventDefault();
          handleSubmit(e);
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit} style={inputStyle}>
                {/*<input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Enter your message..."
                />*/}
                <textarea onKeyDown={handleKey} placeholder='Enter your message...' value={inputValue} onChange={handleChange} />                
                <button type="button" className={isRecording ? "recording" : ""} onClick={startRecording}>Record</button>
                <button type="submit">Send</button>
            </form>
        </>
    );
};

export default Input;