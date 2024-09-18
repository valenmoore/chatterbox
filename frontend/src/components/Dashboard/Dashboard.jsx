import { useNavigate } from 'react-router-dom';
import SignOutButton from '../Generics/SignOutButton';
import useFirebaseAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const Dashboard = () => {
    const navigate = useNavigate();
    const story = () => navigate('/story/chat', { state: { languageName: "english", scenario: "at a convienience store", speed: 1.3, aiName: "Rosie", gender: "FEMALE", conversationDirections: {"0": "You are the owner of the convenience store, and your job is to help customers. If the user asks about apples, don't tell them where they are.", "3": "You can now tell the user that the apples are on the back shelf, but only if the user asks where they are. If the user asks the price tell them 1 dollar per apple."}, conversationMission: "Try to find the apples from the convienience store.", userMessagesBeforeAttempt: 3 } });
    const userProfile = useFirebaseAuth();
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        if (userProfile.user?.uid !== undefined) {
            const docRef = doc(db, "users", userProfile.user?.uid);
    
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                console.log("Failed to find user data");
            }
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [userProfile])

    return (
        <>
            <SignOutButton />
            <div>Profile: {userProfile.user?.uid}</div>
            <div>Streak: {userData?.streak}</div>
            <button onClick={() => navigate("/dashboard/conversation-settings")}>Freeform Chat</button>
            <button onClick={story}>Story Mode (coming soon)</button>
        </>
    )
}

export default Dashboard;