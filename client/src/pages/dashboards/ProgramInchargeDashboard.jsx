import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import Calendar from '../../components/Calendar';
import { useNavigate } from 'react-router-dom';

function ProgramInchargeDashboard() {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();
  
  const handleManageCourses = () => {
    console.log('View Courses')
    navigate('/manageCourses')
  }

  return (
    <div className='dashboard'>
      <div className="user-info">
        <p className='title'>Program Incharge Info</p>
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{currentUser.name}</td>
            </tr>
            <tr>
              <td>Username:</td>
              <td>{currentUser.username}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{currentUser.email}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="quick-actions">
        <p className='title'>Quick Actions</p>
        <div className="buttons">
          <button className='quick-action-btn' onClick={handleManageCourses}>Manage Courses</button>
        </div>
      </div>
      {/* <Calendar type="program-incharge" /> */}
    </div>
  )
}

export default ProgramInchargeDashboard