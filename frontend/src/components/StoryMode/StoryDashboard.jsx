import useFirebaseAuth from '../../hooks/useAuth';
import { addPeopleToFirestore, addPlacesToFirestore, updateUserPlaces } from '../../utils/storyFunctions';
import FriendsPanel from './FriendsPanel/FriendsPanel';
import Map from './Map/Map'

const StoryDashboard = () => {
    const userProfile = useFirebaseAuth();
    if (userProfile.isLoading) return (<div>Loading</div>)
    else return (
        <div>
            <button onClick={() => addPlacesToFirestore()}>Update Places</button>
            <button onClick={() => addPeopleToFirestore()}>Update People</button>
            <button onClick={() => updateUserPlaces(userProfile.user.uid)}>Update User Places</button>
            <FriendsPanel userProfile={userProfile} />
            <Map />
        </div>
    )
}

export default StoryDashboard;