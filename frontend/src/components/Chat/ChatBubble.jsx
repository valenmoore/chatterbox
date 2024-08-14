import React from 'react';


const ChatBubble = ({ message, translateFunction, language, isUser = true }) => {
    const words = message.split(' ');
    const translateWord = async (e) => {
        const element = e.currentTarget;
        let translated = await translateFunction(language.abrev, "en", element.innerHTML);
        const prevText = element.previousSibling ? element.previousSibling.innerHTML : null;
        console.log(prevText)
        translated = !prevText || prevText.includes(".") || prevText.includes("!") || prevText.includes("?") ? 
            translated.charAt(0).toUpperCase() + translated.slice(1) : 
            translated.toLowerCase()
        element.innerHTML = translated + " ";
        element.style += "translated";
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
        const fullSplitText = Array.from(target.children)
            .filter((child) => child.tagName.toLowerCase() === 'span')
            .map((span) => ({
                text: span.innerHTML.replace("/n", "").replace("&nbsp;", ""),
                isTranslated: span.classList.contains("translated")
            }));
    
        // Find start and end indices of selected text
        const startIndex = target.innerText.indexOf(selectedText);
        const endIndex = startIndex + selectedText.length;
    
        // Extract the full highlighted chunk as a substring of the full text
        let textChunk = target.innerText.substring(startIndex, endIndex).trim();
    
        const beginningWordIndex = getWordIndex(target.innerText, startIndex);
        const finalWordIndex = getWordIndex(target.innerText, endIndex);
    
        // Translate the selected text
        const result = await translateFunction(language.abrev, "en", textChunk);
    
        // Split translation into words
        const splitResult = result.split(" ");
    
        // Replace old language version of selected text with translated text
        fullSplitText.splice(beginningWordIndex, finalWordIndex - beginningWordIndex + 1, ...splitResult.map((word) => ({ text: word + " ", isTranslated: true })));
    
        // Reset the target element
        target.innerHTML = '';
    
        // Create spans for each word in the text
        fullSplitText.forEach(({ text, isTranslated }) => {
            if (text.trim()) {
                const span = document.createElement("span");
                span.innerHTML = text;
                if (isTranslated) span.classList.add("translated");
                span.addEventListener("click", translateWord)
                target.appendChild(span);
            }
        });
    
        console.log(result);
    };
    
    const handleSelection = (e) => {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            translateSelection(e.currentTarget, selection.toString());
        }
    }
    return (
        <div className={`chat-bubble ${isUser ? 'user' : 'ai'}`} onMouseUp={handleSelection}>
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