import React, { useState } from 'react'
import BackToDashboard from '../../components/BackToDashboard'
import { getUserDetails } from '../../utils/auth';

function AddExam() {

  const { token } = getUserDetails();

  const getCourseId = async (courseCode) => {
    const response = await fetch('http://localhost:8080/api/course/' + courseCode, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    });
    if (response.ok) {
      const course = await response.json();
      // console.log(course);
      return course.data._id;
    } else {
      console.log("Error");
    }
  }

  const createAndGetMcqQuestionsIds = async (e) => {
    const question1 = {
      questionText: e.target[5].value,
      options: [
        {
          text: e.target[6].value,
          isCorrect: e.target[7].checked,
        },
        {
          text: e.target[8].value,
          isCorrect: e.target[9].checked,
        },
        {
          text: e.target[10].value,
          isCorrect: e.target[11].checked,
        },
        {
          text: e.target[12].value,
          isCorrect: e.target[13].checked,
        }
      ],
      marks: 1
    };
    const question2 = {
      questionText: e.target[14].value,
      options: [
        {
          text: e.target[15].value,
          isCorrect: e.target[16].checked,
        },
        {
          text: e.target[17].value,
          isCorrect: e.target[18].checked,
        },
        {
          text: e.target[19].value,
          isCorrect: e.target[20].checked,
        },
        {
          text: e.target[21].value,
          isCorrect: e.target[22].checked,
        }
      ],
      marks: 1
    };
    const question3 = {
      questionText: e.target[23].value,
      options: [
        {
          text: e.target[24].value,
          isCorrect: e.target[25].checked,
        },
        {
          text: e.target[26].value,
          isCorrect: e.target[27].checked,
        },
        {
          text: e.target[28].value,
          isCorrect: e.target[29].checked,
        },
        {
          text: e.target[30].value,
          isCorrect: e.target[31].checked,
        }
      ],
      marks: 1
    };
    const question4 = {
      questionText: e.target[32].value,
      options: [
        {
          text: e.target[33].value,
          isCorrect: e.target[34].checked,
        },
        {
          text: e.target[35].value,
          isCorrect: e.target[36].checked,
        },
        {
          text: e.target[37].value,
          isCorrect: e.target[38].checked,
        },
        {
          text: e.target[39].value,
          isCorrect: e.target[40].checked,
        }
      ],
      marks: 1
    };

    const mcqQuestionInfos = [question1, question2, question3, question4];
    const mcqQuestionIds = [];

    for (let i = 0; i < mcqQuestionInfos.length; i++) {
      const response = await fetch('http://localhost:8080/api/mcq-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(mcqQuestionInfos[i])
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        mcqQuestionIds.push(data.data._id);
      } else {
        console.log("Error");
      }
    }
    return mcqQuestionIds;
  }


  const handleAddCourse = async (e) => {
    e.preventDefault();

    console.log("Add Exam")

    const courseCode = e.target[0].value;
    const courseId = await getCourseId(courseCode);
    const name = e.target[1].value;
    const syllabus = e.target[2].value.split(',').map((item) => item.trim());
    const duration = e.target[3].value;
    const dateTime = e.target[4].value;
    const mcqQuestionIds = await createAndGetMcqQuestionsIds(e);

    // creating exam
    const examInfo = {
      name,
      courseId,
      syllabus,
      duration,
      dateTime,
      mcqQuestionIds,
      maxMarks: 4,
      resultAnalytics: {
        totalAttendees: 0,
        totalMarksScored: 0,
        highestMarksInfo: {
          marks: 0,
          studentId: null,
        },
      }
    };

    const response = await fetch('http://localhost:8080/api/exam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(examInfo)
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data.data);
      // clear all fields
      for (let i = 0; i < e.target.length; i++) {
        e.target[i].value = '';
        e.target[i].checked = false;
      }
    } else {
      console.log(data.message)
      console.log("Error");
    }
  }

  return (
    <div className='add-course-container'>
      <BackToDashboard />
      <div className='course-info'>
        <p className='title'>Add Exam</p>
        <p className='subtitle font-bold'>Enter the following information to add an exam:</p>
        <form className='add-exam-form' onSubmit={handleAddCourse}>
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Exam Name</th>
                <th>Syllabus</th>
                <th>Duration (mins)</th>
                <th>Date and Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="text" placeholder="Course Code" /></td>
                <td><input type="text" placeholder="Exam Name" /></td>
                <td><input type="text" placeholder="Syllabus" /></td>
                <td><input type="text" placeholder="Duration (mins)" /></td>
                <td><input type="datetime-local" placeholder="Date and Time" /></td>
              </tr>
            </tbody>
          </table>

          <p className='subtitle font-bold'>Enter Questions:</p>
          <table>
            <thead>
              <tr>
                <th>Question 1</th>
                <th>Option 1</th>
                <th>Option 2</th>
                <th>Option 3</th>
                <th>Option 4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="text" placeholder="Question 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 1" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 2" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 3" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 4" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Question 2</th>
                <th>Option 1</th>
                <th>Option 2</th>
                <th>Option 3</th>
                <th>Option 4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="text" placeholder="Question 2" />
                </td>
                <td>
                  <input type="text" placeholder="Option 1" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 2" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 3" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 4" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Question 3</th>
                <th>Option 1</th>
                <th>Option 2</th>
                <th>Option 3</th>
                <th>Option 4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="text" placeholder="Question 3" />
                </td>
                <td>
                  <input type="text" placeholder="Option 1" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 2" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 3" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 4" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Question 4</th>
                <th>Option 1</th>
                <th>Option 2</th>
                <th>Option 3</th>
                <th>Option 4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="text" placeholder="Question 4" />
                </td>
                <td>
                  <input type="text" placeholder="Option 1" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 2" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 3" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
                <td>
                  <input type="text" placeholder="Option 4" />
                  <br />
                  Correct: <input type="checkbox" name="Option 1" />
                </td>
              </tr>
            </tbody>
          </table>
          <button type='submit'>Add Exam</button>
        </form  >
      </div>
    </div>
  )
}

export default AddExam