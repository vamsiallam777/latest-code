import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Side from './side';
import Room from './Room';
import Student from './Student';
import StudentList from './StudentList';
import SectionList from './SectionList';
import Invigilator from './Invigilator';
import Subject from './Subject';
import Exam from './Exam';
import './Dashboard.css';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const DashboardHome = () => (
    <div className="dashboard-home">
      <h1>Welcome to Seating Management System</h1>
      {/* Add your dashboard content here */}
    </div>
  );  return (
    <div className="dashboard-container">
      <Side onSidebarToggle={setIsSidebarOpen} />      <main className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/dashboard" element={<DashboardHome />} />          <Route path="/rooms" element={<Room />} />
          <Route path="/students" element={<Student />} />
          <Route path="/sections/branch/:branchId" element={<SectionList />} />
          <Route path="/invigilators" element={<Invigilator />} />
          <Route path="/subjects" element={<Subject />} />
          <Route path="/exams" element={<Exam />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;