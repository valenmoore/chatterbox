import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, doc, setDoc } from "firebase/firestore";
const Signup = () => {
    const navigate = useNavigate();
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    useEffect(() => {
        // Assuming you want to print the directory of the current file
        const currentFilePath = new URL(import.meta.url).pathname;
        const currentDirectory = getCurrentDirectory(currentFilePath);
        console.log('Current directory:', currentDirectory);
      }, []);
    
      const getCurrentDirectory = (filePath) => {
        // Split the file path by "/"
        const parts = filePath.split('/');
        // Remove the last element (file name) to get the directory path
        parts.pop();
        // Join the parts back together to form the directory path
        return parts.join('/');
      };
 
    const onSubmit = async (e) => {
      e.preventDefault()
     
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            const ref = collection(db, "users");
            await setDoc(doc(ref, user.uid), {
                email: user.email,
                username,
                saves: [],
                streak: 0,
                practicedToday: false
            });
            navigate("/login")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ..
        });
 
   
    }
 
  return (
    <div className='signup'>
        <div className="header">
            <button onClick={() => navigate("/")}>Back Home</button>
            <div className="text">
                <h2>Sign up for Chatterbox</h2>
                <img src="/color-icon.svg" />
            </div>
            <div className="blank"></div>
        </div>      
        <form className='input-form'>                                                                                            
            <div>
                <label htmlFor="email-address">
                    Email address
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  
                    required                                    
                    placeholder="Email address"                                
                />
            </div>

            <div>
                <label htmlFor="password">
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required                                 
                    placeholder="Password"              
                />
            </div>
            <div>
                <label htmlFor="username">
                    Username
                </label>
                <input
                    type="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    required                                 
                    placeholder="Username"              
                />
            </div>                                             
            
            <button
                type="submit" 
                onClick={onSubmit}                        
            >  
                Sign up                                
            </button>
                                                            
        </form>
        
        <p>
            Already have an account?{' '}
            <NavLink to="/login" >
                Sign in
            </NavLink>
        </p>                   
    </div>
  )
}
 
export default Signup