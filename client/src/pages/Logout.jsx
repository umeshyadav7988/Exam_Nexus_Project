import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';
import { removeAuthToken, removeUserDetails } from '../utils/auth';

function Logout() {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  useEffect(() => {
    removeAuthToken();
    removeUserDetails();
    setCurrentUser(null);
    navigate('/');
  }, []);

  return (
    <div>Logout</div>
  )
}

export default Logout