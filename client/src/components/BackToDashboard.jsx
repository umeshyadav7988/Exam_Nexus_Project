import React from 'react'
import { useNavigate } from 'react-router-dom';

function BackToDashboard() {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }
  
  return (
    <div className="back-to-dashboard-btn">
      <button onClick={handleBackToDashboard}>Back to Dashboard</button>
    </div>
  )
}

export default BackToDashboard