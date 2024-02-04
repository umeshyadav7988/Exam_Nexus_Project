import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();
  
  const handleManageStudents = () => {
    console.log('Manage Students')
    navigate('/manageStudents')
  }

  const handleManageProfessors = () => {
    console.log('Manage Professors')
    navigate('/manageProfessors')
  }

  const handleManageProgramIncharges = () => {
    console.log('Manage Program Incharges')
    navigate('/manageProgramIncharges')
  }

  const handleManageAdmins = () => {
    console.log('Manage Admins')
    navigate('/manageAdmins')
  }

  return (
    <div className='dashboard'>
      <div className="user-info">
        <p className='title'>Admin Info</p>
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
          <button className='quick-action-btn' onClick={handleManageStudents}>Manage Students</button>
          <button className='quick-action-btn' onClick={handleManageProfessors}>Manage Professors</button>
          <button className='quick-action-btn' onClick={handleManageProgramIncharges}>Manage Program Incharges</button>
          <button className='quick-action-btn' onClick={handleManageAdmins}>Manage Admins</button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard