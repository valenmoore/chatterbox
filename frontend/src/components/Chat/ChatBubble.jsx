import React, { useState } from 'react';

const ChatBubble = ({ message, translateFunction, language, blurred, isUser = true }) => {
    const [isBlurred, setIsBlurred] = useState(blurred);

    const words = message.split(' ');
    const translateWord = async (e) => {
        if (!isBlurred) {
            const element = e.currentTarget;
            let translated = await translateFunction(language.abrev, "en", element.innerHTML);
            const prevText = element.previousSibling ? element.previousSibling.innerHTML : null;
            console.log(prevText)
            translated = !prevText || prevText.includes(".") || prevText.includes("!") || prevText.includes("?") ? 
                translated.charAt(0).toUpperCase() + translated.slice(1) : 
                translated.toLowerCase()
            element.innerHTML = translated + " ";
            element.classList += "translated";
        }
    }
    const getWordIndex = (fullString, startIndex) => {
        let wordIndex = 0;
        for (let i = 0; i < startIndex; i++) {
            if (fullString[i] === " ") wordIndex++;
        }
        return wordIndex;
    }
    
    const translateSelection = async (target, selection) => {
        const selectedText = selection.replace(/\&nbsp;/g, '');
    
        // Extract words from spans
        const fullChildren = Array.from(target.children)
            .filter((child) => child.tagName.toLowerCase() === 'span');
        const fullSplitText = [];
        
        for (const span of fullChildren) {
            const text = span.innerHTML.replace("/n", "").replace("&nbsp;", "").replace("  ", " ");
            console.log(text);
            if (text !== " " && text !== "  " && text !== "   ") {
                fullSplitText.push({
                    text,
                    isTranslated: span.classList.contains("translated"),
                    newTranslated: false
                })
            }
        };

        // Find start and end indices of selected text
        const startIndex = target.innerText.indexOf(selectedText);
        const endIndex = startIndex + selectedText.length;

        // Extract the full highlighted chunk as a substring of the full text
        let textChunk = target.innerText.substring(startIndex, endIndex).trim();
    
        const beginningWordIndex = getWordIndex(target.innerText, startIndex);
        const finalWordIndex = getWordIndex(target.innerText, endIndex) + 1;
        
        const words = target.innerText.split(" ");
        const translateText = words.slice(beginningWordIndex, finalWordIndex).join(" ");
        // Translate the selected text
        const result = await translateFunction(language.abrev, "en", translateText);
    
        // Split translation into words
        const splitResult = result.split(" ");
        console.log(fullSplitText[beginningWordIndex], fullSplitText[finalWordIndex])
    
        // Replace old language version of selected text with translated text
        fullSplitText.splice(beginningWordIndex, finalWordIndex - beginningWordIndex, ...splitResult.map((word) => ({ text: word + " ", isTranslated: true, newTranslated: true })));
    
        // Reset the target element
        target.innerHTML = '';
    
        // Create spans for each word in the text
        fullSplitText.forEach(({ text, isTranslated, newTranslated }) => {
            if (text.trim()) {
                const span = document.createElement("span");
                span.innerHTML = text;
                if (isTranslated) span.classList.add("translated");
                if (newTranslated) span.classList.add("new")
                span.addEventListener("click", translateWord)
                target.appendChild(span);
            }
        });
    };
    
    const handleSelection = (e) => {
        const selection = window.getSelection();
        if (selection && selection.toString() && !isBlurred) {
            translateSelection(e.currentTarget, selection.toString());
        }
    }

    const checkBlur = () => {
        if (isBlurred) setIsBlurred(false);
    }

    return (
        <div className={`chat-bubble ${isUser ? 'user' : 'ai'} ${isBlurred && !isUser ? 'blurred' : ''}`} onMouseUp={handleSelection} onClick={checkBlur}>
            {words.map((word, index) => (
                <span key={index} onClick={translateWord}>
                    {word}
                    {index !== words.length - 1 && ' '}
                </span>
            ))}
        </div>
    );
};

export default ChatBubble;