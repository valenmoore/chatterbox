import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';

const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in.
        setUser(authUser);
      } else {
        // No user is signed in.
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  return { user, isLoading };
};

export default useFirebaseAuth;