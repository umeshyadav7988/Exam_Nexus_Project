import React, { useContext } from 'react'
import { AuthContext } from './contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    // console.log("Not logged in. Navigating to home page");
    return <Navigate to={"/"} />
  }
  return children;
}

export default ProtectedRoute