import React from 'react'
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from "../ProtectedRoute"
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import StudentDashboard from "./dashboards/StudentDashboard";
import ProfessorDashboard from "./dashboards/ProfessorDashboard";
import ProgramInchargeDashboard from "./dashboards/ProgramInchargeDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import "./Dashboard.scss";

function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  
  const MainDashboard = () => {
    return (
      <>
        {
          // return dashboard based on user type i.e. student, professor, program-incharge, or admin
          currentUser.type === "student"
            ? <StudentDashboard />
            : currentUser.type === "professor"
              ? <ProfessorDashboard />
              : currentUser.type === "program-incharge"
                ? <ProgramInchargeDashboard />
                : <AdminDashboard />
        }
      </>
    )
  }

  return (
    <div className='flex justify-around items-center w-full h-full'>
      <ProtectedRoute>
        <Routes>
          <Route path='*' element={<MainDashboard />} />
        </Routes>
      </ProtectedRoute>
    </div>
  )
}

export default Dashboard

