import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebase';

const Home = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              // ...
              console.log("uid", uid)
            } else {
              // User is signed out
              // ...
              console.log("user is logged out")
            }
          });
         
    }, [])
    return (
        <>
          <div className="home">
            <div className="header">
              <button onClick={() => navigate("/signup")}>Sign up</button>
              <div className="text colorful"><h1>Chatterbox</h1><img src="/color-icon.svg" /></div>
              <button onClick={() => navigate("/login")}>Log in</button>
            </div>
          </div>
          <div className='text'>
            <h2><span>What is </span><span className='colorful'>Chatterbox</span>?</h2>
            <p><span>Chatterbox</span> is a website designed to allow users to practice and improve their language speaking skills.</p>
            <p>With <span>Chatterbox</span>, users are able to freely converse with an AI bot in a language of their choice, with no stakes and no pressure, any time, any place.</p>

            <h2><span>What does </span><span className='colorful'>Chatterbox</span> have to offer?</h2>
            <p>Chatterbox features support in <span className='bold'>59</span> languages. Over <span className="bold">5 billion</span> people speak one of the languages that Chatterbox offers.</p>
            <p>Chatterbox analyzes your speech and vocabulary and tracks your statistics over time so you can see your improvement.</p>
            <p>Chatterbox allows you to practice listening comprehension and speaking, essential linguistic skills for real-life conversations that are often overlooked.</p>
            <p>Chatterbox comes with a built in translation function that allows you to click or highlight to translate chunks of text that you do not recognize.</p>
            <p>Most importantly, Chatterbox was designed to be completely free to use, so anyone, anywhere, can improve their conversational skills.</p>
          </div>
        </>
    );
};

export default Home;