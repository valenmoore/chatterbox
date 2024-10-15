import React, { useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom';
//import autocomplete from '../../autocomplete';
//import { languageArray } from '../../languageData';

const SettingsInput = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = location.state;
    const { index } = useParams();


    useEffect(() => {
        //const input: HTMLInputElement | null = document.getElementById("language-input") as HTMLInputElement;
        //if (input) autocomplete(input, languageArray)
    }, []);
    const goToConversation = (e) => {
        e.preventDefault();
        // const languageName = e.target.elements['language-input'].value;
        const languageName = params.languageName;
        const scenario = e.target.elements['situation-input'].value;
        const speed = parseFloat(e.target.elements['speed-input'].value);
        const aiName = e.target.elements['name-input'].value;
        const gender = "NEUTRAL";
        const blur = e.target.elements['blur-input'].value;
        navigate('/saves/' + index + "/chat", { state: { languageName, scenario, speed, aiName, gender, blurMessages: blur } });
    }
    return (
        <>
            <div className="settings-window">
                <h2>Conversation Settings</h2>
                <form autoComplete="off" onSubmit={goToConversation}>
                    <label htmlFor='name-input'>AI Name: </label>
                    <input name="name-input" type="text" placeholder='Bob'></input>
                    <label htmlFor='situation-input'>Situation: </label>
                    <input name="situation-input" type="text" placeholder='e.g.: on a train in Paris'></input>
                    {/* TODO: add randomize button for situation */}
                    <label htmlFor='speed-input'>Speed: </label>
                    <input name='speed-input' type='range' min={0.25} max={2} defaultValue={1} step={0.1}></input>
                    <label htmlFor='blur-input'>Blur messages: </label>
                    <input name='blur-input' type='checkbox'></input>
                    <button type='submit'>Go</button>
                </form>
            </div>
        </>
    )
}

export default SettingsInput;