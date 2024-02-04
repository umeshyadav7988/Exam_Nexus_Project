// src/components/PastExams.js
import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import ExamResult from './ExamResult';
import './PastExams.css'; // Import the CSS file

const PastExams = () => {
  // Placeholder data for past exams
  const pastExamsData = [
    { name: 'ST-1', date: '2023-12-10', subject: 'DSA' },
    { name: 'ST-2', date: '2023-12-16', subject: 'NALR' },
    { name: 'ST-2', date: '2023-12-23', subject: 'DSA' },
    // Add more past exams as needed
  ];

  return (
    <div>
      <Navbar />
      <div className="past-exams-container">
        <h2>Past Exams</h2>
        {pastExamsData.map((exam, index) => (
          <div key={index} className="exam-card">
            <div>
              <h3>{exam.name}</h3>
              <p>Date: {exam.date}</p>
              <p>Subject: {exam.subject}</p>
            </div>
            <div>
            <Link to="/exam-result"><button>Show Result</button></Link>
              <button>Appeal Result</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastExams;
