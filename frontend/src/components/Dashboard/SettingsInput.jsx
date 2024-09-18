import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
//import autocomplete from '../../autocomplete';
//import { languageArray } from '../../languageData';

const SettingsInput = () => {
    const navigate = useNavigate();
    useEffect(() => {
        //const input: HTMLInputElement | null = document.getElementById("language-input") as HTMLInputElement;
        //if (input) autocomplete(input, languageArray)
    }, []);
    const goToConversation = (e) => {
        e.preventDefault();
        const languageName = e.target.elements['language-input'].value;
        const scenario = e.target.elements['situation-input'].value;
        const speed = parseFloat(e.target.elements['speed-input'].value);
        const aiName = e.target.elements['name-input'].value;
        const chatType = e.target.elements['chat-type'].value;
        const gender = "NEUTRAL";
        navigate('/' + chatType, { state: { languageName, scenario, speed, aiName, gender, blurMessages: true } });
    }
    return (
        <>
            <form autoComplete="off" onSubmit={goToConversation}>
                <label htmlFor='chat-type'>Type: </label>
                <select name='chat-type'>
                    <option value="exam-chat">Exam Prep</option>
                    <option value="chat">Freeform Chat</option>
                </select>
                <label htmlFor='language-input'>Language: </label>
                <input id="language-input" name='language-input' placeholder='language'></input>
                {/*TODO: add autocomplete*/}
                <label htmlFor='name-input'>Name: </label>
                <input name="name-input" placeholder='Bob'></input>
                <label htmlFor='situation-input'>Situation: </label>
                <input name="situation-input" placeholder='e.g.: on a train in Paris'></input>
                {/* TODO: add randomize button for situation */}
                <label htmlFor='speed-input'>Speed: </label>
                <input name='speed-input' type='range' min={0.25} max={2} defaultValue={1} step={0.1}></input>
                <button type='submit'>Go</button>
            </form>
        </>
    )
}

export default SettingsInput;