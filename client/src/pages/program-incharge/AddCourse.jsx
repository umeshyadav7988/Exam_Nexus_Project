import React, { useState } from 'react'
import BackToDashboard from '../../components/BackToDashboard'
import { getUserDetails } from '../../utils/auth';

function AddCourse() {

  const { token } = getUserDetails();

  const getProfessorId = async (username) => {
    if (!token) return;
    let url = `http://localhost:8080/api/professor/${username}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.data._id;
  }

  const getStudentIds = async (username) => {
    if (!token) return;
    let url = `http://localhost:8080/api/student/${username}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.data._id;
  }

  const handleAddCourse = async (e) => {
    e.preventDefault();

    let studentIds = [];
    
    console.log("Add Course")

    const studentUsernames = e.target[4].value.split(",").map((student) => student.trim());
    console.log(studentUsernames)

    for (const username of studentUsernames) {
      studentIds.push(await getStudentIds(username));
    }

    await getProfessorId(e.target[2].value);

    let courseInfo = {
      courseCode: e.target[0].value,
      name: e.target[1].value,
      professorId: await getProfessorId(e.target[2].value),
      syllabus: e.target[3].value.split(",").map((syllabus) => syllabus.trim()),
      studentIds: studentIds
    }
    console.log(courseInfo)

    let url = "http://localhost:8080/api/course"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(courseInfo)
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Course added successfully")
      console.log(data.data)
      e.target[0].value = "";
      e.target[1].value = "";
      e.target[2].value = "";
      e.target[3].value = "";
      e.target[4].value = "";
    }
    else {
      console.log("Error adding course")
      console.log(data)
    }
  }

  return (
    <div className='add-course-container'>
      <BackToDashboard />
      <div className='course-info'>
        <p className='title'>Add Course</p>
        <form className='add-course-form' onSubmit={handleAddCourse}>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Professor Username</th>
                <th>Syllabus</th>
                <th>Student Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="text" placeholder="Code" /></td>
                <td><input type="text" placeholder="Name" /></td>
                <td><input type="text" placeholder="Professor Username" /></td>
                <td><input type="text" placeholder="Syllabus" /></td>
                <td><input type="text" placeholder="Student Usernames" /></td>
              </tr>
            </tbody>
          </table>
          <button type='submit'>Add Course</button>
        </form  >
      </div>
    </div>
  )
}

export default AddCourse