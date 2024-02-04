// src/components/Homepage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Homepage.css';

const Homepage = () => {
    const navigate = useNavigate();
  
    const handleLogin = () => {
      // Add your login logic here
      console.log('Login button clicked');
  
      // After successful login, navigate to the Student Dashboard
      navigate('/student-dashboard');
    };

  return (
    <div>
      <Navbar />
      <div className="animation-section">
        <div className="book">📚</div>
        <div className="pc">💻</div>
        <div className="exam">📝</div>
      </div>
      <div className="homepage-container">
        <div className="features-section">
          <h2>Website Features</h2>
          <div className="feature">
            <h3>Online Courses</h3>
            <p>Access a wide range of online courses at your fingertips.</p>
          </div>
          <div className="feature">
            <h3>Interactive Exams</h3>
            <p>Take interactive exams to test your knowledge.</p>
          </div>
          <div className="feature">
            <h3>Community Forums</h3>
            <p>Engage with other users in community forums.</p>
          </div>
        </div>
        <div className="login-section">
          <div className="login-box">
            <h2>Login</h2>
            <form>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" />

              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" />

              <button type="button" onClick={handleLogin}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
