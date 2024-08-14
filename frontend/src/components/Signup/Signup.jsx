import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, doc, setDoc } from "firebase/firestore";
const Signup = () => {
    const navigate = useNavigate();
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
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
                storySaves: [
                    {
                        language: "french",
                        map: {
                            "Rose's": {
                                inventory: {
                                    "apple": {
                                        quantity: 5,
                                        price: 2,
                                        flRequirement: 100
                                    }
                                }
                            }
                        }
                    }
                ]
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
    <main >        
        <section>
            <div>
                <div>                  
                    <h1> FocusApp </h1>                                                                            
                    <form>                                                                                            
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
            </div>
        </section>
    </main>
  )
}
 
export default Signup