import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Map = () => {
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const navigateToPlace = id => {
        navigate("/story/map/place/" + id);
    }
    useEffect(() => {
        const fetchPlaces = async () => {
            const placesCollection = collection(db, 'places');
            const placesSnapshot = await getDocs(placesCollection);
            const placesList = placesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPlaces(placesList);
        };
        fetchPlaces();
    }, [])

    return (
        <>
            <div>map</div>
            <div>
                {places.map(place => {
                    return (
                        <div key={place.id} onClick={() => navigateToPlace(place.id)}>
                            {place.name}
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Map;