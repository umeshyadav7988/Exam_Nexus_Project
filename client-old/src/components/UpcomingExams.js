// src/components/UpcomingExams.js
import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import './UpcomingExams.css';

const UpcomingExams = () => {
  // Placeholder data for upcoming exams
  const upcomingExamsData = [
    { name: 'ETE', date: '2024-01-14', subject: 'MERN' },
    { name: 'ETE', date: '2024-01-25', subject: 'DSA' },
    {name : 'ETE',date:'2024-01-29',subject:'NALR'}
    // Add more exams as needed
  ];

  // Function to check if the current date is the same as the exam date
  const isDateSameAsToday = (examDate) => {
    const today = new Date().toISOString().split('T')[0];
    return examDate === today;
  };

  return (
    <div>
      <Navbar />
      <div className="upcoming-exams-container">
        <h2>Upcoming Exams</h2>
        {upcomingExamsData.map((exam, index) => (
          <div key={index} className="exam-card">
            <div>
              <h3>{exam.name}</h3>
              <p>Date: {exam.date}</p>
              <p>Subject: {exam.subject}</p>
            </div>
            <div>
              <button disabled={!isDateSameAsToday(exam.date)}>View Syllabus</button>
              <Link to="/attend-exam">
                <button disabled={!isDateSameAsToday(exam.date)}>Take Test</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingExams;
