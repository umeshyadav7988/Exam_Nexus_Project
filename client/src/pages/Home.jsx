import React from 'react'
import homeBgVerticalImage from '../assets/home-bg-vertical.jpg'
import "./Home.scss";
import Login from '../components/Login';

function Home() {
  return (
    <div id='home-page-content'>
      <div id="home-page-info">
        <div id='home-picture-container'>
          <img src={homeBgVerticalImage} alt="home-bg-image" />
        </div>
        <div id='home-info-container'>
          <p className='home-info-title'>
            <strong>
              ExamNexus
            </strong>
            <br />
            Revolutionizing Education Assessment
          </p>
          <div className='home-info-box'>
            <p className='home-info-heading'>Unified Test Platform</p>
            <p className='home-info-content'>All tests in one place, for students and professors and administrators.</p>
          </div>
          <div className='home-info-box'>
            <p className='home-info-heading'>Exam Schedule</p>
            <p className='home-info-content'>View all your upcoming and past exams, and how you performed in them.</p>
          </div>
          <div className='home-info-box'>
            <p className='home-info-heading'>Raise Appeals</p>
            <p className='home-info-content'>Feel that the answers in the exam were marked incorrect? Raise an appeal!</p>
          </div>
        </div>
      </div>
      {
        <Login />
      }
    </div>
  )
}

export default Home