// src/components/StudentDash.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './StudentDash.css';

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getDayName = (dayIndex) =>
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];

const generateCalendar = () => {
  const currentMonth = new Date().getMonth();
  const totalDays = daysInMonth(new Date().getFullYear(), currentMonth);
  const firstDay = new Date(new Date().getFullYear(), currentMonth, 1).getDay();

  const daysArray = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: totalDays }, (_, index) => index + 1)
  );

  const weeks = [];
  while (daysArray.length) {
    weeks.push(daysArray.splice(0, 7));
  }

  const dayNames = Array.from({ length: 7 }, (_, index) => getDayName(index));

  return (
    <div className="calendar">
      <div className="calendar-row">
        {dayNames.map((day, index) => (
          <div key={index} className="calendar-day-name">
            {day}
          </div>
        ))}
      </div>
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="calendar-row">
          {week.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`calendar-day${day ? '' : ' empty'}`}
            >
              {day}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const ExamAnalysis = () => {
  // Placeholder data for exam analysis
  const examData = {
    averageScore: 75,
    highestScore: 90,
    lowestScore: 60,
  };

  return (
    <div className="exam-analysis">
      <h3>Exam Analysis</h3>
      <p>Average Score: {examData.averageScore}%</p>
      <p>Highest Score: {examData.highestScore}%</p>
      <p>Lowest Score: {examData.lowestScore}%</p>
    </div>
  );
};



const StudentDash = () => {
  return (
    <div>
      <Navbar />
      <div className="student-dashboard-container">
        <div className="left-section">
          <div className="person-icon"></div>
          <div className="exam-analysis">
            <ExamAnalysis />
          </div>
        </div>
        <div className="middle-section">
        <h4>Options</h4>
        <Link to="/upcoming-exams">
            <button>View Upcoming Exams</button>
          </Link>
          <Link to="/attend-exam"><button>Attend Exam</button></Link>
          <Link to="/past-exams">
            <button>View Past Exams</button>
          </Link>
        </div>
        <div className="right-section">
          <h3>Calendar</h3>
          {generateCalendar()}
        </div>
      </div>
    </div>
  );
};

export default StudentDash;
