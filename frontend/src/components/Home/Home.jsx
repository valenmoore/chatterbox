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
            <div>home</div>
            <button onClick={() => navigate("/signup")}>Sign up</button>
            <button onClick={() => navigate("/login")}>Log in</button>
        </>
    );
};

export default Home;