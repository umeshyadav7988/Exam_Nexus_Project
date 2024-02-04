// src/components/ExamResult.js
import React from 'react';
import Navbar from './Navbar';
import './ExamResult.css'; // Import the CSS file

const ExamResult = () => {
  // Placeholder data for exam result and questions
  const examResultData = {
    examName: 'Sample Exam',
    examDate: '2024-03-15',
    totalMarks: 100,
    totalques: 10,
    marksObt:90,
    analysis: 'You performed well in this exam. Keep it up!',
    averageScore: 75,
    highestScore: 90,
    lowestScore: 60,
    questions: [
      {
        questionText: 'Ques. 1 What is the capital of France?',
        options: ['1. Berlin', '2. Madrid', '3. Paris', '4. Rome'],
        correctAnswer: 'Paris',
      },
      {
        questionText: 'Ques. 2 What is the capital of France?',
        options: ['1. Berlin', '2. Madrid', '3. Paris', '4. Rome'],
        correctAnswer: 'Paris',
      },
      {
        questionText: 'Ques. 3 What is the capital of France?',
        options: ['1. Berlin', '2. Madrid', '3. Paris', '4. Rome'],
        correctAnswer: 'Paris',
      },
      {
        questionText: 'Ques. 4 What is the capital of France?',
        options: ['1. Berlin', '2. Madrid', '3. Paris', '4. Rome'],
        correctAnswer: 'Paris',
      },
      {
        questionText: 'Ques. 5 What is the capital of France?',
        options: ['1. Berlin', '2. Madrid', '3. Paris', '4. Rome'],
        correctAnswer: 'Paris',
      },
      {
        questionText: 'Ques. 6 What is the capital of France?',
        options: ['1. Berlin', '2. Madrid', '3. Paris', '4. Rome'],
        correctAnswer: 'Paris',
      },
      {
        questionText: 'Ques. 7 What is the capital of France?',
        options: ['1. Berlin', '2. Madrid', '3. Paris', '4. Rome'],
        correctAnswer: 'Paris',
      },
      {
        questionText: 'Ques. 8 What is the capital of France?',
        options: ['1. Berlin', '2. Madrid', '3. Paris', '4. Rome'],
        correctAnswer: 'Paris',
      },
      {
        questionText: 'Ques. 9 What is the capital of France?',
        options: ['1. Berlin', '2. Madrid', '3. Paris', '4. Rome'],
        correctAnswer: 'Paris',
      },
      {
        questionText: 'Ques. 10 What is the capital of France?',
        options: ['1. Berlin', '2. Madrid', '3. Paris', '4. Rome'],
        correctAnswer: 'Paris',
      },
      // Add more questions as needed
    ],
  };

  return (
    <div>
      <Navbar />
      <div className="exam-result-container">
        <div className="left-section">
          <h2>{examResultData.examName}</h2>
          <p>Date: {examResultData.examDate}</p>
          <p>Total Marks: {examResultData.totalMarks}</p>
          <p>Total Questions: {examResultData.totalques}</p>
        </div>
        <div className="middle-section">
          <div className='exam-analysis'>
          <h2>Exam Analysis</h2>
          <p><h4>Score : {examResultData.marksObt}</h4></p>
          <p>Average Score : {examResultData.averageScore}</p>
          <p>Highest Score : {examResultData.highestScore}</p>
          <p>Lowest Score : {examResultData.lowestScore}</p>
          <p>{examResultData.analysis}</p>
          </div>
        </div>
        <div className="right-section">
            <p>If you have any problem <br></br>then you can raise an appeal.</p>
          <button>Appeal Result</button>
        </div>
      </div>
      <div className="answers-section">
        <h2><u>Questions</u></h2>
        {examResultData.questions.map((question, index) => (
          <div key={index} className="question-container">
            <p className="question">{question.questionText}</p>
            <div className="options-container">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="option">
                  {option}
                </div>
              ))}
            </div>
            <p className="correct-answer">Correct Answer: {question.correctAnswer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamResult;
