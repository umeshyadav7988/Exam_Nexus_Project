// src/components/AttendExam.js
import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import './AttendExam.css'; // Import the CSS file

const AttendExam = () => {
  // Placeholder data for the exam
  const examData = {
    name: 'Sample Exam',
    subject: 'Mathematics',
    duration: '1 hour',
    totalMarks: '100',
    numberOfMCQs: '20',
    instructions: [
      'Read all questions carefully before answering.',
      'Do not use any unauthorized materials.',
      'Ensure a stable internet connection.',
      'You cannot go back to previous questions once answered.',
      'Each MCQ has only one correct answer.',
      'Ensure your surroundings are quiet and free from distractions.',
      'The exam will auto-submit once the time limit is reached.',
      'Review your answers before submitting the exam.',
      'Do not share your login credentials.',
      'If you face technical issues, contact support immediately.',
    ],
  };

  return (
    <div>
      <Navbar />
      <div className="attend-exam-container">
        <div className="left-section">
          <div className="exam-details">
            <h2>{examData.name}</h2>
            <p>Subject: {examData.subject}</p>
            <p>Duration: {examData.duration}</p>
            <p>Total Marks: {examData.totalMarks}</p>
            <p>Number of MCQs: {examData.numberOfMCQs}</p>
          </div>
        </div>
        <div className="right-section">
          <div className="exam-instructions">
            <h3>Exam Instructions</h3>
            <ul>
              {examData.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
          <div className="start-test-button">
            <Link to="/take-exam">
              <button>Start Test</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendExam;
