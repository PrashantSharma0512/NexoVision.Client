import React, { useState } from 'react';
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
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaFingerprint,
  FaShieldAlt,
  FaBolt,
  FaArrowRight,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/dashboard', roles: ['student', 'teacher', 'admin'] },
    { name: 'Face Registration', icon: <FaUserCircle />, path: '/register-face', roles: ['student'] },
    { name: 'Attendance', icon: <FaCamera />, path: '/attendance', roles: ['student'] },
    { name: 'Records', icon: <FaChartBar />, path: '/attendance-report', roles: ['student', 'teacher', 'admin'] },
    { name: 'Notes', icon: <FaBook />, path: '/notes', roles: ['student', 'teacher'] },
    { name: 'College ERP', icon: <FaUniversity />, path: '/erp', roles: ['admin', 'teacher'] },
    { name: 'Settings', icon: <FaCog />, path: '/settings', roles: ['student', 'teacher', 'admin'] },
  ];

  const filteredSidebarItems = sidebarItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Premium Sidebar */}
      <aside className={`
        w-72 bg-[#0f172a]/95 lg:bg-[#0f172a]/50 backdrop-blur-2xl border-r border-slate-800/50 
        fixed top-0 bottom-0 left-0 z-[60] transition-transform duration-500 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FaFingerprint className="text-white text-xl" />
              </div>
              <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">NexoVision</h1>
            </div>
            <button className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
              <FaTimes size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
            {filteredSidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className="group flex items-center w-full p-4 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all duration-200"
              >
                <span className="mr-4 text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                <span className="font-semibold tracking-wide">{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="pt-6 mt-6 border-t border-slate-800/50">
            {user ? (
              <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-sm tracking-tight truncate">{user?.name || 'Agent User'}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{user?.role || 'Guest'}</p>
                      {user?.rollno && <span className="text-[8px] text-blue-400 font-black border border-blue-500/20 px-1 rounded">#{user.rollno}</span>}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center justify-center w-full p-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 font-bold text-sm"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-bold"
                >
                  <FaSignInAlt className="mb-2 text-blue-400" /> Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all text-xs font-bold shadow-lg shadow-blue-600/20"
                >
                  <FaUserPlus className="mb-2" /> Join
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Luxury Main Content */}
      <main className="flex-1 lg:ml-72 relative min-w-0 transition-all duration-300">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] -z-10"></div>

        {/* Global Toolbar */}
        <header className="sticky top-0 bg-[#020617]/50 backdrop-blur-md border-b border-slate-800/50 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                className="lg:hidden p-2 rounded-lg bg-slate-800/50 text-slate-400"
                onClick={() => setIsSidebarOpen(true)}
              >
                <FaBars />
              </button>
              <div className="flex items-center space-x-2 text-slate-400 text-xs sm:text-sm font-medium">
                <span className="hidden sm:inline hover:text-white cursor-pointer transition-colors">Platform</span>
                <span className="hidden sm:inline">/</span>
                <span className="text-white font-bold tracking-wide">Overview</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="flex flex-col items-end">
                <span className="text-[8px] sm:text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black leading-none">System</span>
                <span className="flex items-center text-emerald-400 text-[10px] sm:text-xs font-bold mt-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-ping"></span> Live
                </span>
              </div>
              <button className="p-2 sm:p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700 transition-all">
                <FaCog size={14} className="text-slate-400" />
              </button>
            </div>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          {/* Hero Mastery */}
          <div className="mb-12 sm:mb-16 relative">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-4 sm:mb-6 leading-tight sm:leading-none">
              The Future of <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 italic">Smart Identity.</span>
            </h1>
            <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed font-medium mb-8 sm:mb-10">
              NexoVision integrates military-grade facial recognition with seamless academic management, automating workflows so you can focus on excellence.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => navigate('/register-face')}
                className="group flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black transition-all shadow-xl shadow-blue-600/30"
              >
                Get Started <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black transition-all text-center">
                Documentation
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {[
              { title: 'Neural Biometrics', desc: 'Secure 3D face mapping with 99.9% accuracy across all lighting conditions.', icon: <FaFingerprint />, color: 'text-blue-400' },
              { title: 'Real-time Analytics', desc: 'Instant presence reports and trend analysis for institutional oversight.', icon: <FaChartBar />, color: 'text-indigo-400' },
              { title: 'Encryption Core', desc: 'End-to-end encrypted biometric data storage for absolute privacy.', icon: <FaShieldAlt />, color: 'text-purple-400' }
            ].map((feature, i) => (
              <div key={i} className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700 transition-all group">
                <div className={`${feature.color} text-2xl sm:text-3xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform origin-left`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-black mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Live Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Active Sessions', val: '2,841', icon: <FaUsersCog />, trend: '+12%' },
              { label: 'Response', val: '42ms', icon: <FaBolt />, trend: '-8%' },
              { label: 'Verified', val: '1.2M', icon: <FaUserCircle />, trend: 'Global' },
              { label: 'Uptime', val: '100%', icon: <FaShieldAlt />, trend: 'Stable' }
            ].map((stat, i) => (
              <div key={i} className="p-4 sm:p-6 rounded-2xl bg-[#0f172a] border border-slate-800/50 flex flex-col justify-between h-32 sm:h-40">
                <div className="flex justify-between items-start">
                  <div className="p-2 sm:p-3 bg-slate-800/50 rounded-lg sm:rounded-xl text-slate-400">{stat.icon}</div>
                  <span className="text-[8px] sm:text-[10px] font-black text-emerald-400 tracking-widest">{stat.trend}</span>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black">{stat.val}</p>
                  <p className="text-[8px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cinematic Footer */}
        <footer className="mt-12 sm:mt-20 py-12 sm:py-20 border-t border-slate-900 bg-[#020617]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center sm:text-left">
            <div className="sm:col-span-2">
              <h1 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6 text-center sm:text-left">NexoVision.</h1>
              <p className="text-slate-500 max-w-sm font-medium leading-relaxed italic mx-auto sm:mx-0">
                Defining the intersection of hardware biometrics and software intelligence since 2024.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-4 sm:mb-6 uppercase text-[10px] tracking-[0.3em]">Network</h4>
              <ul className="space-y-2 sm:space-y-4 text-xs sm:text-sm text-slate-400 font-medium">
                <li className="hover:text-white cursor-pointer transition-colors">Security Protokol</li>
                <li className="hover:text-white cursor-pointer transition-colors">API Integration</li>
                <li className="hover:text-white cursor-pointer transition-colors">Global Nodes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 sm:mb-6 uppercase text-[10px] tracking-[0.3em]">Support</h4>
              <ul className="space-y-2 sm:space-y-4 text-xs sm:text-sm text-slate-400 font-medium">
                <li className="hover:text-white cursor-pointer transition-colors">Command Center</li>
                <li className="hover:text-white cursor-pointer transition-colors">Legal Docs</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Support</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 sm:mt-20 flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em]">
            <span>© NexoVision Bio-Systems 2026</span>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-10">
              <span className="hover:text-slate-400 cursor-pointer">Stability: 1.0.4-release</span>
              <span className="hover:text-slate-400 cursor-pointer text-center">Region: Global-North</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;