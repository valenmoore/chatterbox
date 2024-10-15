import React, { useState, useEffect, useRef } from 'react';
// import Microphone from '../svgs/Microphone';

const Input = ({ handlePrompt, language, inputStyle, isAudioPlaying, setParentHeight }) => {
    const [inputValue, setInputValue] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const textareaRef = useRef(null);

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const [recognition] = useState(new SpeechRecognition());

    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.lang = language.bcp;

    let currentText = "";

    useEffect(() => {
        // Initialize MediaRecorder and SpeechRecognition
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const mR = new MediaRecorder(stream);

            mR.addEventListener('dataavailable', event => {
                setAudioChunks((prev) => [...prev, event.data]);
            });

            setMediaRecorder(mR);
        });

        recognition.addEventListener('result', (e) => {
            currentText = Array.from(e.results)
                .map(result => result[0].transcript)
                .join('');
            setInputValue(currentText);
        });

        recognition.addEventListener("end", () => console.log("Speech recognition ended"));

        return () => {
            recognition.removeEventListener('result', () => {});
            recognition.removeEventListener('end', () => {});
        };
    }, [recognition]);

    useEffect(() => {
        // Adjust parent height based on the content of the textarea
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to calculate new height
            textarea.style.height = `${textarea.scrollHeight}px`;
            setParentHeight(`${textarea.scrollHeight}px`);
        }
    }, [inputValue, window.innerWidth]);

    const handleChange = (e) => {
        e.preventDefault();
        setInputValue(e.target.value);
    };

    const stopRecording = () => {
        if (isRecording) {
            recognition.stop();
            if (mediaRecorder) {
                mediaRecorder.stop();
            }
            setIsRecording(false);
        }
    }

    const handleSubmit = async (e) => {
        if (!isAudioPlaying && inputValue !== '') {
            e.preventDefault();
            stopRecording();
            setInputValue(''); // Clear input after submission
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            if (currentText !== "") {
                handlePrompt(currentText, audio);
            } else handlePrompt(inputValue, audio)
            setAudioChunks([]); // Clear the chunks after processing
            setInputValue('');
        }
    };

    const startRecording = () => {
        if (isRecording) return;
        setAudioChunks([]); // Clear previous chunks before starting new recording
        recognition.start();
        if (mediaRecorder) {
            mediaRecorder.start(500);
        }
        setIsRecording(true);
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} style={inputStyle} className='input-form'>
                <button
                    type="button"
                    className={isRecording ? "mic recording" : "mic"}
                    onClick={isRecording ? stopRecording : startRecording}
                >
                    <img src="/microphone.svg" />
                </button>
                {/*<input
                    onKeyDown={handleKey}
                    placeholder='Enter your message...'
                    value={inputValue}
                    onChange={handleChange}
                />*/}
                <textarea
                    className='input'
                    ref={textareaRef}
                    value={inputValue}
                    onKeyDown={handleKey}
                    onChange={handleChange}
                    style={{
                        boxSizing: 'border-box',
                        overflow: 'hidden', // Hide scrollbar as the height is auto-adjusting
                    }}
                />
                <button disabled={isAudioPlaying} type="submit">
                    <img src="/send.svg" />
                </button>
            </form>
        </>
    );
};

export default Input;