import React, { useEffect, useState } from 'react'
import BackToDashboard from '../../components/BackToDashboard'
import UserTableEntry from './UserTableEntry'
import { getUserDetails } from '../../utils/auth';
import AddUserTableEntry from './AddUserTableEntry';

function ManageStudents() {
  const { token } = getUserDetails();

  const [students, setStudents] = useState([]);

  const getStudents = async () => {
    if (!token) return;
    let url = "http://localhost:8080/api/students"
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    setStudents(data.data);
  }

  useEffect(() => {
    getStudents()
  }, [])

  return (
    <div className='manage-users-container'>
      <BackToDashboard />
      <div className='users-info-and-options'>
        <p className='title'>Manage Students</p>
        <table>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Batch</th>
              <th>Semester</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AddUserTableEntry type="student" regetUsers={getStudents} />
            {
              students.map((student, index) =>
                <UserTableEntry key={index} index={index} user={student} type="student" regetUsers={getStudents} />
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageStudents