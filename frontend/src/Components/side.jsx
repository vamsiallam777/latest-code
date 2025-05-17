import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, clearUser } from '../redux/userSlice';
import { FaBars, FaTimes, FaUser, FaDoorOpen, FaSignOutAlt, FaHome, FaEnvelope, FaPhone, FaIdCard, FaUserGraduate, FaBook, FaCalendarAlt } from 'react-icons/fa';
import './Side.css';

const Side = ({ onSidebarToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector(selectUser);

  console.log('userData in sidebar:', userData); // Add this for debugging

  const userRole = localStorage.getItem('userRole'); // Add this line

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onSidebarToggle(!isOpen);
  };

  const toggleProfile = () => setShowProfile(!showProfile);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };  const menuItems = [
    { title: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
    { title: 'Rooms', icon: <FaDoorOpen />, path: '/rooms' },
    { title: 'Students', icon: <FaUserGraduate />, path: '/students' },
    { title: 'Invigilators', icon: <FaIdCard />, path: '/invigilators' },
    { title: 'Subjects', icon: <FaBook />, path: '/subjects' },
    { title: 'Exams', icon: <FaCalendarAlt />, path: '/exams' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>{isOpen ? 'Seating System' : <FaBars />}</h2>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <FaTimes /> : null}
        </button>
      </div>

      <div className="profile-and-nav">
        <div className="menu-items">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className="menu-item"
              onClick={() => navigate(item.path)}
            >
              <span className="icon">{item.icon}</span>
              {isOpen && <span className="title">{item.title}</span>}
            </div>
          ))}
        </div>

        <div className="profile-section" onClick={toggleProfile}>
          <div className="profile-container">
            <FaUser className="profile-icon" />
            {isOpen && (
              <span className="profile-name">{userData?.name || 'User'}</span>
            )}
          </div>
        </div>

        {showProfile && isOpen && (
          <div className="profile-details">
            <div className="profile-detail-item">
              <FaEnvelope className="detail-icon" />
              <span>{userData?.email || 'No email'}</span>
            </div>
            <div className="profile-detail-item">
              <FaPhone className="detail-icon" />
              <span>{userData?.phone || 'No phone number'}</span>
            </div>
            <div className="profile-detail-item">
              <FaIdCard className="detail-icon" />
              <span>{userRole || userData?.role || 'No role'}</span>
            </div>
          </div>
        )}

        <div className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Side;
