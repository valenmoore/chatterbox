import React from "react";
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const SignOutButton = () => {
    const signUserOut = () => {
        // Sign out the current user
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
            console.error('Error signing out:', error);
        });
    }
    return (
        <button onClick={signUserOut}>Sign Out</button>
    )
}

export default SignOutButton;