import React, { useState } from 'react';

const Autocomplete = ({ suggestions, onSelect }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const onChange = (e) => {
    const userInput = e.target.value;
    const filtered = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    setInputValue(userInput);
    setFilteredSuggestions(filtered);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
  };

  const selectSuggestion = (value) => {
    setInputValue(value);
    setShowSuggestions(false);
    onSelect(value); // Pass the selected value to the parent component
  };

  const onClick = (e) => {
    selectSuggestion(e.target.innerText);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      selectSuggestion(filteredSuggestions[activeSuggestionIndex]);
    } else if (e.key === 'ArrowUp') {
      if (activeSuggestionIndex === 0) return;
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
    } else if (e.key === 'ArrowDown') {
      if (activeSuggestionIndex === filteredSuggestions.length - 1) return;
      setActiveSuggestionIndex(activeSuggestionIndex + 1);
    }
  };

  const SuggestionsListComponent = () => {
    return filteredSuggestions.length ? (
      <div className="suggestions-box">
        {filteredSuggestions.map((suggestion, index) => {
          let className = 'suggestion-box';
          if (index === activeSuggestionIndex) {
            className += ' suggestion-active';
          }
          return (
            <div className={className} key={suggestion} onClick={onClick}>
              {suggestion}
            </div>
          );
        })}
      </div>
    ) : (
      <div className="no-suggestions">
        <em>No suggestions available</em>
      </div>
    );
  };

  return (
    <>
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={inputValue}
        className="autocomplete-input"
      />
      {showSuggestions && inputValue && <SuggestionsListComponent />}
    </>
  );
};

export default Autocomplete;