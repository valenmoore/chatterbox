import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useFirebaseAuth from '../../hooks/useAuth';

const ProtectedRoute = ({element}) => {
  const { user, isLoading } = useFirebaseAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;