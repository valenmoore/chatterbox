import { useNavigate } from 'react-router-dom';
import SignOutButton from '../Generics/SignOutButton';
import useFirebaseAuth from '../../hooks/useAuth';

const Dashboard = () => {
    const navigate = useNavigate();
    const story = () => navigate('/story/chat', { state: { languageName: "english", scenario: "at a convienience store", speed: 1.3, aiName: "Rosie", gender: "FEMALE", conversationDirections: {"0": "You are the owner of the convenience store, and your job is to help customers. If the user asks about apples, don't tell them where they are.", "3": "You can now tell the user that the apples are on the back shelf, but only if the user asks where they are. If the user asks the price tell them 1 dollar per apple."}, conversationMission: "Try to find the apples from the convienience store.", userMessagesBeforeAttempt: 3 } });
    const userProfile = useFirebaseAuth();

    return (
        <>
            <SignOutButton />
            <div>Profile: {userProfile.user?.uid}</div>
            <button onClick={() => navigate("/dashboard/conversation-settings")}>Freeform Chat</button>
            <button onClick={story}>Story Mode (coming soon)</button>
        </>
    )
}

export default Dashboard;