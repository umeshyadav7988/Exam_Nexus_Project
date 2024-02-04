import React, { useState } from 'react'
import { getUserDetails } from '../../utils/auth';

function AddUserTableEntry({ type, regetUsers }) {
  const { token } = getUserDetails();

  const [newUsername, setNewUsername] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newBatch, setNewBatch] = useState('')
  const [newSemester, setNewSemester] = useState('')

  const handleNewUsernameChange = (e) => {
    setNewUsername(e.target.value)
  }

  const handleNewNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNewEmailChange = (e) => {
    setNewEmail(e.target.value)
  }

  const handleNewBatchChange = (e) => {
    setNewBatch(e.target.value)
  }

  const handleNewSemesterChange = (e) => {
    setNewSemester(e.target.value)
  }

  const handleAddUser = () => {
    const addUser = async () => {
      if (!token) return;
      let url = `http://localhost:8080/api/${type}`
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: newUsername,
          name: newName,
          email: newEmail,
          batch: newBatch,
          semester: newSemester
        })
      });
      console.log(response)
      if (response.ok) {
        console.log('User Added')
        setNewUsername('')
        setNewName('')
        setNewEmail('')
        setNewBatch('')
        setNewSemester('')
        regetUsers()
      } else {
        console.log('User Not Added')
        const data = await response.json();
        console.log(data)
        alert(data.message)
      }
    }
    addUser()
  }

  return (
    <tr>
      <td>auto</td>
      <td><input type="text" value={newUsername} placeholder='New User Username' onChange={handleNewUsernameChange} /></td>
      <td><input type="text" value={newName} placeholder='New User Name' onChange={handleNewNameChange} /></td>
      <td><input type="text" value={newEmail} placeholder='New User Email' onChange={handleNewEmailChange} /></td>
      {
        type === 'student' &&
        <>
          <td><input type="text" value={newBatch} placeholder='New User Batch' onChange={handleNewBatchChange} /></td>
          <td><input type="text" value={newSemester} placeholder='New User Semester' onChange={handleNewSemesterChange} /></td>
        </>
      }
      <td>
        <button onClick={handleAddUser}>Add New User</button>
      </td>
    </tr>
  )
}

export default AddUserTableEntry