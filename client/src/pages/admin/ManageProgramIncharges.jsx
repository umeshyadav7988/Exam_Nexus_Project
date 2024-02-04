import React, { useEffect, useState } from 'react'
import BackToDashboard from '../../components/BackToDashboard'
import UserTableEntry from './UserTableEntry'
import { getUserDetails } from '../../utils/auth';
import AddUserTableEntry from './AddUserTableEntry';

function ManageProgramIncharges() {
  const { token } = getUserDetails();

  const [programIncharges, setProgramIncharges] = useState([]);

  const getProgramIncharges = async () => {
    if (!token) return;
    let url = "http://localhost:8080/api/program-incharges"
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    setProgramIncharges(data.data);
  }

  useEffect(() => {
    getProgramIncharges()
  }, [])

  return (
    <div className='manage-users-container'>
      <BackToDashboard />
      <div className='users-info-and-options'>
        <p className='title'>Manage Program Incharges</p>
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
            <AddUserTableEntry type="program-incharge" regetUsers={getProgramIncharges} />
            {
              programIncharges.map((programIncharges, index) =>
                <UserTableEntry key={index} index={index} user={programIncharges} type="program-incharge" regetUsers={getProgramIncharges} />
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageProgramIncharges