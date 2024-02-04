// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/path/to/logo.png" alt="Company Logo" />
        <span>Company Name</span>
      </div>
      <div className="links">
        <Link to="/">Login</Link>
        <Link to="/homepage">Homepage</Link>
      </div>
    </nav>
  );
};

export default Navbar;
