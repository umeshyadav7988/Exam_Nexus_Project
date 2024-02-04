import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { saveAuthToken, saveUserDetails } from '../utils/auth';

function Login() {

  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) navigate('/dashboard')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let index in Array.from(e.target)) {
      if (!e.target[index].value && e.target[index].tagName.toLowerCase() != "button") {
        const errorMessage = "Please enter values in all inputs"
        console.log(errorMessage);
        setErrMsg(errorMessage);
        return;
      }
    }
    const username = e.target[0].value
    const password = e.target[1].value
    const type = e.target[2].value

    // Make a POST request to server
    // If successful, save the token in local storage
    try {
      const res = await fetch(`http://localhost:8080/api/${type}/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.ok) {
        const data = await res.json()
        saveAuthToken(data.token)
        // get user details
        const res2 = await fetch(`http://localhost:8080/api/${type}/${username}`, {
          headers: { 'Authorization': `Bearer ${data.token}` }
        })
        if (res2.ok) {
          const data2 = await res2.json()
          console.log(data2)
          const fullUserDetails = { ...(data2.data), type, token: data.token }
          setCurrentUser(fullUserDetails)
          saveUserDetails(fullUserDetails)
          navigate('/dashboard')
        }
      }
      else setErrMsg("Invalid credentials")
    } catch (error) {
      console.log(error)
      setErrMsg(error.message)
    }
  }

  return (
    <div id='login-form-container' className='bg-orange-100'>
      <p className='login-form-heading'>Login to ExamNexus</p>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="username">Username:</label>
          <input type="text" id='username' name='username' placeholder="Enter your ID" />
        </div>
        <div className="input-container">
          <label htmlFor="username">Password:</label>
          <input type="password" id='password' name='password' placeholder="Enter your password" />
        </div>
        <div className="input-container">
          <label htmlFor="username">User Type:</label>
          <select name="type" id="user-type-select">
            <option value="student">Student</option>
            <option value="professor">Professor</option>
            <option value="program-incharge">Program Incharge</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
      {errMsg && <p>{errMsg}</p>}
    </div>
  )
}

export default Login