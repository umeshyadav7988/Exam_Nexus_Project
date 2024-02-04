import React, { useState } from 'react'
import { getUserDetails } from '../../utils/auth';

function UserTableEntry({ index, user, type, regetUsers }) {
  const { token } = getUserDetails();

  const [username, setUsername] = useState(user.username)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [batch, setBatch] = useState(user.batch)
  const [semester, setSemester] = useState(user.semester)

  const [editMode, setEditMode] = useState(false)

  const handleSave = () => {
    console.log('Save')
    const updateUser = async () => {
      if (!token) return;
      let url = `http://localhost:8080/api/${type}/${user._id}`
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          name,
          email,
          batch,
          semester
        })
      });
      console.log(response)
      if (response.ok) {
        setEditMode(false)
        console.log('User Updated')
      } else {
        console.log('User Not Updated')
        const data = await response.json();
        console.log(data)
        alert(data.message)
      }
    }
    updateUser()
  }

  const handleEdit = () => {
    if (editMode) {
      handleSave()
    } else {
      setEditMode(true)
    }
  }

  const handleDelete = () => {
    console.log('Delete')
    const deleteUser = async () => {
      if (!token) return;
      let url = `http://localhost:8080/api/${type}/${user._id}`
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        console.log('User Deleted')
        regetUsers()
      } else {
        console.log('User Not Deleted')
      }
    }
    deleteUser()
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handleBatchChange = (e) => {
    setBatch(e.target.value)
  }

  const handleSemesterChange = (e) => {
    setSemester(e.target.value)
  }

  return (
    <tr>
      <td><p>{index + 1}</p></td>
      <td><input type="text" value={username} onChange={handleUsernameChange} disabled={!editMode} /></td>
      <td><input type="text" value={name} onChange={handleNameChange} disabled={!editMode} /></td>
      <td><input type="text" value={email} onChange={handleEmailChange} disabled={!editMode} /></td>
      {type === 'student' && 
        <>
          <td><input type="text" value={batch} onChange={handleBatchChange} disabled={!editMode} /></td>
          <td><input type="text" value={semester} onChange={handleSemesterChange} disabled={!editMode} /></td>
        </>
      }
      <td>
        <button onClick={handleEdit} className='mr-2'>{editMode ? "Save" : "Edit"}</button>
        <button onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  )
}

export default UserTableEntry