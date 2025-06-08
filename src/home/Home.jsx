import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaUserCircle,
  FaCamera,
  FaBook,
  FaChartBar,
  FaUsersCog,
  FaCog,
  FaHome,
  FaUniversity,
  FaChalkboardTeacher,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt
} from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Sidebar navigation items
  const sidebarItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/', roles: ['student', 'teacher', 'admin'] },
    { name: 'Face Registration', icon: <FaUserCircle />, path: '/register-face', roles: ['student'] },
    { name: 'Mark Attendance', icon: <FaCamera />, path: '/attendance', roles: ['student'] },
    { name: 'Notes Dashboard', icon: <FaBook />, path: '/notes', roles: ['student', 'teacher'] },
    { name: 'College ERP', icon: <FaUniversity />, path: '/erp', roles: ['admin', 'teacher'] },
    { name: 'Teacher Details', icon: <FaChalkboardTeacher />, path: '/teachers', roles: ['admin'] },
    { name: 'Attendance Reports', icon: <FaChartBar />, path: '/reports', roles: ['teacher', 'admin'] },
    { name: 'User Management', icon: <FaUsersCog />, path: '/users', roles: ['admin'] },
    { name: 'Settings', icon: <FaCog />, path: '/settings', roles: ['student', 'teacher', 'admin'] },
  ];

  // Filter sidebar items based on user role
  const filteredSidebarItems = sidebarItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md fixed h-full">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">FaceAttend</h1>
          {user && (
            <p className="text-sm text-gray-600 mt-1">Welcome, {user.name}</p>
          )}
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {filteredSidebarItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          {user ? (
            <button
              onClick={logout}
              className="flex items-center w-full p-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
            >
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors mb-2"
              >
                <FaSignInAlt className="mr-3" />
                <span>Login</span>
              </button>
              <button
                onClick={() => navigate('/register')}
                className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FaUserPlus className="mr-3" />
                <span>Register</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end h-16">
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <span className="text-gray-700 hidden md:inline">Welcome, {user.name}</span>
                    <button
                      onClick={logout}
                      className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-4 py-2 text-sm text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Nexo Vision Attendance System
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Revolutionizing attendance tracking with facial recognition technology
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-3xl font-bold text-blue-600">98%</h3>
              <p className="mt-2 text-sm font-medium text-gray-500">Recognition Accuracy</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-3xl font-bold text-green-600">24/7</h3>
              <p className="mt-2 text-sm font-medium text-gray-500">System Availability</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-3xl font-bold text-purple-600">1000+</h3>
              <p className="mt-2 text-sm font-medium text-gray-500">Users Registered</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-3xl font-bold text-yellow-600">99.9%</h3>
              <p className="mt-2 text-sm font-medium text-gray-500">Uptime Reliability</p>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            {/* Add your recent activity components here */}
            <div className="text-center py-8 text-gray-400">
              <p>No recent activity to display</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-xl font-bold">FaceAttend</span>
                <p className="mt-2 text-sm text-gray-400">
                  © {new Date().getFullYear()} All rights reserved
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;