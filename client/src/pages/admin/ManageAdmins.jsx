import React, { useEffect, useState } from 'react'
import BackToDashboard from '../../components/BackToDashboard'
import UserTableEntry from './UserTableEntry'
import { getUserDetails } from '../../utils/auth';
import AddUserTableEntry from './AddUserTableEntry';

function ManageAdmins() {
  const { token } = getUserDetails();

  const [admins, setAdmins] = useState([]);

  const getAdmins = async () => {
    if (!token) return;
    let url = "http://localhost:8080/api/admins"
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    setAdmins(data.data);
  }

  useEffect(() => {
    getAdmins()
  }, [])

  return (
    <div className='manage-users-container'>
      <BackToDashboard />
      <div className='users-info-and-options'>
        <p className='title'>Manage Admins</p>
        <table>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AddUserTableEntry type="admin" regetUsers={getAdmins} />
            {
              admins.map((admins, index) =>
                <UserTableEntry key={index} index={index} user={admins} type="admin" regetUsers={getAdmins} />
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageAdmins