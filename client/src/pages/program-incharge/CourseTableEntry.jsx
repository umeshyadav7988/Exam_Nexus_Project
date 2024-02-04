import React, { useEffect, useState } from 'react'
import { getUserDetails } from '../../utils/auth';

function CourseTableEntry({ index, course }) {
  const { token } = getUserDetails();

  const [courseInfo, setCourseInfo] = useState({});
  
  const getCourseInfo = async () => {
    if (!token) return;
    let url = `http://localhost:8080/api/course/${course.courseCode}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    setCourseInfo(data.data);
  }

  useEffect(() => {
    getCourseInfo()
  }, [])

  const handleViewDetails = async () => {
    console.log("View Details")
  }

  return (
    <tr>
      <td><p>{index + 1}</p></td>
      <td><p>{courseInfo.courseCode}</p></td>
      <td><p>{course.name}</p></td>
      <td><p>{courseInfo.professorId?.name + " (" + courseInfo.professorId?.username + ")"} </p></td>
      <td><p>{course.studentIds.length}</p></td>
      {/* <td>
        <button onClick={handleViewDetails}>View Details</button>
      </td> */}
    </tr>
  )
}

export default CourseTableEntry