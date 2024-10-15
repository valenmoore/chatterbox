import { useNavigate } from 'react-router-dom';
import useFirebaseAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import SignOutButton from '../Generics/SignOutButton';
import NewSave from './NewSave/NewSave';
import { languageMap } from '../../constants/constants';

const Dashboard = () => {
    const navigate = useNavigate();
    const story = () => navigate('/story/chat', { state: { languageName: "english", scenario: "at a convienience store", speed: 1.3, aiName: "Rosie", gender: "FEMALE", conversationDirections: {"0": "You are the owner of the convenience store, and your job is to help customers. If the user asks about apples, don't tell them where they are.", "3": "You can now tell the user that the apples are on the back shelf, but only if the user asks where they are. If the user asks the price tell them 1 dollar per apple."}, conversationMission: "Try to find the apples from the convienience store.", userMessagesBeforeAttempt: 3 } });
    const userProfile = useFirebaseAuth();
    const [userData, setUserData] = useState(null);
    const [userSaves, setUserSaves] = useState([]);

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
    }, [userProfile.isLoading])

    useEffect(() => {
        if (userData) {
            const saves = userData.saves || [];
            setUserSaves(saves);
        }
    }, [userData]);

    return (
        <>
            {(userData === null || userProfile.isLoading) ? (<div>Loading...</div>) : (
                <div className="dashboard">
                    <div className="header">
                        <button className="home" onClick={() => navigate("/")}>Home</button>
                        <h1><span>Welcome back, </span><span className='name'>{userData.username}</span>!</h1>
                        <SignOutButton />
                    </div>
                    <div className='saves'>
                        <div className="saves-header">
                            <div className="blank"></div>
                            <h2>Saves</h2>
                            <button onClick={() => navigate("/dashboard/new-save")}>New Save</button>
                        </div>
                        {userSaves.map((m, i) => {
                            return (
                                <button className='save-button' onClick={() => navigate(`/saves/${i}`)} key={i}>
                                    <div className='language'>{languageMap[m.language].full}</div>
                                    <div className='streak'><span>Streak: </span><span className='num'>{userData.saves[i].streak}</span></div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}

export default Dashboard;