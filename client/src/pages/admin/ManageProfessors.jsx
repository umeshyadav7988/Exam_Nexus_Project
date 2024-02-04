import React, { useEffect, useState } from 'react'
import BackToDashboard from '../../components/BackToDashboard'
import UserTableEntry from './UserTableEntry'
import { getUserDetails } from '../../utils/auth';
import AddUserTableEntry from './AddUserTableEntry';

function ManageProfessors() {
  const { token } = getUserDetails();

  const [professors, setProfessors] = useState([]);

  const getProfessors = async () => {
    if (!token) return;
    let url = "http://localhost:8080/api/professors"
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    setProfessors(data.data);
  }

  useEffect(() => {
    getProfessors()
  }, [])

  return (
    <div className='manage-users-container'>
      <BackToDashboard />
      <div className='users-info-and-options'>
        <p className='title'>Manage Professors</p>
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
            <AddUserTableEntry type="professor" regetUsers={getProfessors} />
            {
              professors.map((professors, index) =>
                <UserTableEntry key={index} index={index} user={professors} type="professor" regetUsers={getProfessors} />
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageProfessors