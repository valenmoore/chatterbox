import { useState, useEffect } from "react";

const AIChatBubble = ({ message, translateFunction, conversationStats, setConversationStats, language, blurred }) => {
  const [isBlurred, setIsBlurred] = useState(blurred);
  const [words, setWords] = useState([]);
  const [swoopingIn, setSwoopingIn] = useState(false);

  const clearSelection = () => {
    const sel = window.getSelection ? window.getSelection() : document.selection; // support for all browsers
    if (sel) {
        if (sel.removeAllRanges) {
            sel.removeAllRanges(); // clear for firefox
        } else if (sel.empty) {
            sel.empty(); // chrome, ie, etc.
        }
    }
  }

  const logTranslatedWords = (words) => {
    // log counts of each word translated
    const updatedTranslations = { ...conversationStats.translations }; // Clone the existing translations

    // Loop through the words and update the count
    for (const word of words) {
        if (updatedTranslations[word]) {
            updatedTranslations[word] += 1; // Increment the count for existing words
        } else {
            updatedTranslations[word] = 1; // Initialize the count for new words
        }
    }

    // Update the state once after the loop
    setConversationStats({
        ...conversationStats,
        translations: updatedTranslations,
    });
  }

  const translateWord = async (index) => {
    if (!isBlurred && !words[index].isTranslated) {
      const uppercase = words[index].word[0] === words[index].word[0].toUpperCase();

      logTranslatedWords([words[index].word]);
      let translated = await translateFunction(language.abrev, "en", words[index].word);
      translated = uppercase
        ? translated.charAt(0).toUpperCase() + translated.slice(1)
        : translated.toLowerCase();

      // Update the specific word in the words array
      const updatedWords = [...words];
      updatedWords[index] = { word: translated, isTranslated: true, newTranslated: true };
      setWords(updatedWords);
    }
  };

  const translateSelection = async (startWordIndex, endWordIndex) => {
    // Extract full words within the selection
    const translateText = words.slice(startWordIndex, endWordIndex + 1).map(w => w.word);
    logTranslatedWords(translateText);
    const result = await translateFunction(language.abrev, "en", translateText.join(" "));

    // Split the result and update corresponding words
    const splitResult = result.split(" ");
    const splitObjs = splitResult.map(w => ({ word: w, isTranslated: true, newTranslated: true }));
    const updatedWords = [...words];
    const numWordsToReplace = endWordIndex - startWordIndex + 1;
    updatedWords.splice(startWordIndex, numWordsToReplace, ...splitObjs);
    setWords(updatedWords);
    clearSelection();
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText && !isBlurred) {
        const parent = selection.anchorNode.parentNode.parentElement;
        const children = Array.from(parent.children);
        const startSpanIndex = children.indexOf(selection.anchorNode.parentElement); // gets the start target of selection
        const endSpanIndex = children.indexOf(selection.focusNode.parentElement); // gets the end target of selection
        // Translate the full words within the selection range
        translateSelection(startSpanIndex, endSpanIndex);
    }
  };

  const checkBlur = () => {
    if (isBlurred) setIsBlurred(false);
  };

  useEffect(() => {
    if (message) {
      const newWords = message.split(' ').map((word) => ({
        word,
        isTranslated: false,
        newTranslated: false,
      }));
      setWords(newWords);
      setIsBlurred(blurred); // if blurred, reset

      // Simulate swooping animation
      setSwoopingIn(true);
      setTimeout(() => setSwoopingIn(false), 400);
    }
  }, [message]);

  return (
    (words.length > 0 && <div
        className={`chat-bubble ${isBlurred ? 'blurred' : ''} ${swoopingIn ? 'swoop' : ''}`}
        onMouseUp={handleSelection}
        onClick={checkBlur}
    >
        {words.map((word, index) => (
            <span
                key={index}
                className={`${word.isTranslated ? 'translated ' : ''}${word.newTranslated ? 'new' : ''}`}
                onClick={() => translateWord(index)}
            >
                {word.word}
                {index !== words.length - 1 && ' '}
            </span>
        ))}
    </div>)
  );
};

export default AIChatBubble;
