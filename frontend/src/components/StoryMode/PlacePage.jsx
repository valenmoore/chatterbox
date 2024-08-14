import { useParams } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { db } from '../../firebase';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import useFirebaseAuth from '../../hooks/useAuth';
import { currentLanguage } from '../../constants/constants';

const StorePage = () => {
    const { placeId } = useParams();
    const inputRef = useRef();
    const userProfile = useFirebaseAuth();
    const [place, setPlace] = useState(null);
    const updateFriendshipLevel = async (level) => {
        const userData = ((await getDoc(userProfile.user)).data()).storySaves[currentLanguage];
        if (userData.map[placeName].owner.index === null) {
            // add new friend
        }
        
        await updateDoc(userProfile.user, 
            `storySaves.${currentLanguage}.userInfo.friends.`)
    }
    useEffect(() => {
        const fetchPlaceData = async () => {
            const placeRef = doc(db, "places", placeId);
            const placeData = (await getDoc(placeRef)).data();
            console.log(placeData);
            setPlace(placeData)
        }
        fetchPlaceData();
    }, [])
    return (
        <>
            <div>{place?.name}</div>
            <input ref={inputRef} placeholder="set friendship"></input>
            <button onClick={() => updateFriendshipLevel(inputRef.current.value)}>Submit</button>
        </>
    )
}

export default StorePage;