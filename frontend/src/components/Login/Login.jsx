import { useState, FC } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { NavLink, useNavigate } from 'react-router-dom'
import useFirebaseAuth from '../../hooks/useAuth';
import { useEffect } from 'react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const userProfile = useFirebaseAuth();

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                navigate("/dashboard")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });

    }

    useEffect(() => {
        if (!userProfile.isLoading && userProfile.user) {
            // already logged in
            navigate("/dashboard");
        }
    }, [userProfile.isLoading])

    return (
        <>
                <div className="login">
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
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <button
                                onClick={onLogin}
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <p className="text-sm text-white text-center">
                        No account yet? {' '}
                        <NavLink to="/signup">
                            Sign up
                        </NavLink>
                    </p>
            </div>
        </>
    )
}

export default Login