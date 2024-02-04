import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

function Navbar() {
  let { pathname } = useLocation();

  return (
    <nav className="navbar border-2">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand text-white font-bold ml-8">ExamNexus</Link>
        <div>
          {
            pathname !== "/" &&
            <Link to="/logout" className="navbar-brand">
              <button className="logout-btn" type="submit">
                Logout
              </button>
            </Link>
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar