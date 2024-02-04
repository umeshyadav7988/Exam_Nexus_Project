import React, { useEffect, useState } from 'react'
import BackToDashboard from '../../components/BackToDashboard'
import { getUserDetails } from '../../utils/auth';
import CourseTableEntry from './CourseTableEntry';
import { useNavigate } from 'react-router-dom';

function ManageCourses() {
  const { token } = getUserDetails();

  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  const handleAddCourse = () => {
    console.log("Add Course")
    navigate("/addCourse");
  }

  const getCourses = async () => {
    if (!token) return;
    let url = "http://localhost:8080/api/courses"
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    setCourses(data.data);
  }

  useEffect(() => {
    getCourses()
  }, [])

  return (
    <div className='manage-courses-container'>
      <BackToDashboard />
      <div className='courses-info-and-options'>
        <p className='title'>Manage Courses</p>
        <button onClick={handleAddCourse}>Add Course</button>
        <table>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Code</th>
              <th>Name</th>
              <th>Professor</th>
              <th>Students</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {
              courses.map((course, index) =>
                <CourseTableEntry key={index} index={index} course={course} />
              )
            }
          </tbody>
        </table>
        {/* <div className='courses-list'>
          {courses.map((course, index) => (
            <CourseTableEntry key={index} index={index} course={course} />
          ))}
        </div> */}
      </div>
    </div>
  )
}

export default ManageCourses