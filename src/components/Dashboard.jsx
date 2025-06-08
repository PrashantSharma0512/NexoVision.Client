// src/components/dashboard/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaCalendarCheck, FaStickyNote, FaGlobe, FaDatabase, FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  const navItems = [
    { name: 'Register Face', path: '/register-face', icon: <FaUserPlus className="text-3xl mb-2 text-blue-500" /> },
    { name: 'Face Attendance', path: '/attendance', icon: <FaCalendarCheck className="text-3xl mb-2 text-green-500" /> },
    { name: 'Notes', path: '/notes', icon: <FaStickyNote className="text-3xl mb-2 text-yellow-500" /> },
    { name: 'College Website', path: 'https://www.iimtindia.net/', icon: <FaGlobe className="text-3xl mb-2 text-purple-500" /> },
    { name: 'ERP Portal', path: 'https://iimt.icloudems.com/corecampus/index.php', icon: <FaDatabase className="text-3xl mb-2 text-red-500" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Welcome to Nexo Vision</h1>
        <p className="text-lg text-gray-600">Your smart campus management dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {navItems.map(({ name, path, icon }) => (
          <div 
            key={path}
            onClick={() => handleNavigate(path)}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center border border-transparent hover:border-blue-100"
          >
            {icon}
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{name}</h3>
            <p className="text-gray-500 text-sm">Click to open</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
        className="mt-16 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
      
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Nexo Vision. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;