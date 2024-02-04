// src/components/LoginBox.js
import React from 'react';
import './LoginBox.css';

const LoginBox = ({ handleLogin }) => {
  return (
    <div className="login-container">
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
  );
};

export default LoginBox;
