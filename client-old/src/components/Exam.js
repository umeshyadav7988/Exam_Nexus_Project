// src/components/Exam.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Exam.css'; // Import the CSS file

const Exam = () => {
  // Placeholder data for questions and options
  const questionsData = [
    {
      question: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    },
    // Add more questions as needed
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Placeholder data for exam details
  const examData = {
    examName: 'Sample Exam',
    timeRemaining: 60, // in minutes
    studentName: 'John Doe',
  };

  // Function to handle the next question button click
  const handleNextQuestion = () => {
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    }
  };

  useEffect(() => {
    // Reset the question index when the component mounts
    setCurrentQuestion(0);
  }, []);

  return (
    <div>
      <Navbar>
        <div className="navbar-left">
          <h2>{examData.examName}</h2>
          <p>Time Remaining: {examData.timeRemaining} mins</p>
        </div>
        <div className="navbar-right">
          <p>{examData.studentName}</p>
          <Link to="/student-dash">Profile</Link>
        </div>
      </Navbar>
      <div className="exam-container">
        <div className="left-section">
          {[1, 2, 3,4,5,6,7,8,9,10].map((number) => (
            <div key={number} className={`question-number ${number === currentQuestion + 1 ? 'active' : ''}`}>
              {number}
            </div>
          ))}
        </div>
        <div className="middle-section">
          <h3>Question {currentQuestion + 1}</h3>
          <p>{questionsData[currentQuestion].question}</p>
        </div>
        <div className="right-section">
          {questionsData[currentQuestion].options.map((option, index) => (
            <div key={index} className="option">
              <input type="radio" id={`option${index + 1}`} name="mcq" />
              <label htmlFor={`option${index + 1}`}>{option}</label>
            </div>
          ))}
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      </div>
    </div>
  );
};

export default Exam;
