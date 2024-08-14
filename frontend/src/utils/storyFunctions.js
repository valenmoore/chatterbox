import { getDoc, updateDoc } from 'firebase/firestore'
import { currentLanguage } from '../constants/constants'
import { collection, addDoc, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure Firebase is initialized
import peopleData from '../constants/peopleData'
import placeData from '../constants/placeData'

// Add a place
export const addPlace = async (name, description, xCoord, yCoord) => {
  const placeRef = await addDoc(collection(db, "places"), {
    name: name,
    description: description,
    coordinates: { x: xCoord, y: yCoord }
  });
  console.log("Place added with ID: ", placeRef.id);
}

export const initializePlaceStatusForUser = async (userId) => {
    const places = await getDocs(collection(db, 'places'));
    
    places.forEach(async (place) => {
      await setDoc(doc(db, `users/${userId}/placesStatus/${place.id}`), {
        isLocked: true // or false based on your initial logic
      });
    });
}

// Function to add places to Firestore
export const addPlacesToFirestore = async () => {
    for (const place of placeData) {
        const placeRef = await addDoc(collection(db, 'places'), place)
        console.log(`Added place with ID: ${placeRef.id}`);
    }
};
export const unlockPlaceForUser = async (userId, placeId) => {
    const placeStatusDocRef = doc(db, `users/${userId}/placesStatus/${placeId}`);
    await updateDoc(placeStatusDocRef, {
      isLocked: false
    });
  }

// Add a person
export const addPerson = async (name, placeId) => {
  const personRef = await addDoc(collection(db, "persons"), {
    name: name,
    placeId: placeId
  });
  console.log("Person added with ID: ", personRef.id);
}

export const addPeopleToFirestore = async () => {
    for (const person of peopleData) {
        const q = query(collection(db, 'places'), where('name', '==', person.location));
        const querySnapshot = await getDocs(q);
        const placeId = querySnapshot.docs.length > 0 ?querySnapshot.docs[0].id : null;
        console.log(placeId)
        addPerson(person.name, placeId);
    }
};

export const updateUserPlaces = async userId => {
    const places = await getDocs(collection(db, 'places'));
  
    places.forEach(async (place) => {
      await setDoc(doc(db, `users/${userId}/placesStatus/${place.id}`), {
        isLocked: true
      });
    });
}