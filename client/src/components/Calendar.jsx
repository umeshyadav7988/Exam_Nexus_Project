import React, { useEffect, useState } from 'react';
import './Calendar.scss';
import { getUserDetails } from '../utils/auth';

const Calendar = ({ type, user }) => {

  const { token } = getUserDetails();

  const [highlightedDays, setHighlightedDays] = useState([5, 12, 15, 22]); // Example list of days to highlight

  // get all days with exams in this month
  const getExamDays = async () => {
    const url = `http://localhost:8080/api/exams?${type}Id=${user._id}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    const data = await res.json();
    if (res.ok) {
      const examDays = data.data.filter(
        (exam) => new Date(exam.dateTime).getMonth() === new Date().getMonth()
      ).map((exam) => new Date(exam.dateTime).getDate());
      setHighlightedDays(examDays);
    } else {
      console.log('Error getting exam days')
    }
  };

  useEffect(() => {
    // get all days with exams
    getExamDays();
  }, []);

  const getCurrentMonthDays = () => {
    const currentMonth = new Date().getMonth();
    const firstDay = new Date(new Date().getFullYear(), currentMonth, 1).getDay();
    const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();

    // Calculate empty spaces for trailing days at the beginning
    const emptySpaces = Array.from({ length: firstDay }, (_, i) => ({ day: null, key: `empty-${i}` }));

    // Generate days for the current month
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, key: i + 1 }));

    return [...emptySpaces, ...monthDays];
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-container">
      <h2 className='title'>Current Month</h2>
      <div className="calendar">
        {/* Days of the week */}
        {daysOfWeek.map((day) => (
          <div key={day} className="day day-of-week">
            {day}
          </div>
        ))}

        {/* Days of the month */}
        {getCurrentMonthDays().map(({ day, key }) => (
          <div
            key={key}
            className={`day ${day !== null ? 'month-day' : 'empty-day'} ${["student", "professor"].includes(type) && highlightedDays.includes(day) ? 'highlighted' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
