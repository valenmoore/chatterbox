import React, { useState, useRef, useEffect } from 'react';

const ResizableInput = () => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);
  const [parentHeight, setParentHeight] = useState('auto');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    // Adjust parent height based on the content of the textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to calculate new height
      textarea.style.height = `${textarea.scrollHeight}px`;
      setParentHeight(`${textarea.scrollHeight}px`);
    }
  }, [inputValue]);

  return (
    <div style={{ border: '1px solid black', padding: '10px', height: parentHeight, transition: 'height 0.3s' }}>
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        style={{
          width: '100%',
          height: 'auto',
          minHeight: '40px', // minimum height of the input
          padding: '8px',
          boxSizing: 'border-box',
          overflow: 'hidden', // Hide scrollbar as the height is auto-adjusting
        }}
      />
    </div>
  );
};

export default ResizableInput;