import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUserPlus, FaCalendarCheck, FaStickyNote, FaGlobe, 
  FaDatabase, FaSignOutAlt, FaShapes, FaShieldAlt, 
  FaChartLine, FaArrowRight, FaBell
} from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigate = (path) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  const menuItems = [
    { 
      name: 'Register Face', 
      desc: 'Initialize biometric profile', 
      path: '/register-face', 
      icon: <FaUserPlus />, 
      color: 'from-blue-600 to-indigo-600',
      role: ['student']
    },
    { 
      name: 'Face Attendance', 
      desc: 'Execute biometric verification', 
      path: '/attendance', 
      icon: <FaCalendarCheck />, 
      color: 'from-emerald-600 to-teal-600',
      role: ['student']
    },
    { 
      name: 'Study Archive', 
      desc: 'Access global knowledge base', 
      path: '/notes', 
      icon: <FaStickyNote />, 
      color: 'from-amber-600 to-orange-600',
      role: ['student', 'teacher', 'admin']
    },
    { 
      name: 'Campus Portal', 
      desc: 'External institutional site', 
      path: 'https://www.iimtindia.net/', 
      icon: <FaGlobe />, 
      color: 'from-purple-600 to-pink-600',
      role: ['student', 'teacher', 'admin']
    },
    { 
      name: 'ERP Gateway', 
      desc: 'Academic management system', 
      path: 'https://iimt.icloudems.com/corecampus/index.php', 
      icon: <FaDatabase />, 
      color: 'from-rose-600 to-red-600',
      role: ['student', 'teacher', 'admin']
    },
    { 
      name: 'Attendance Ledger', 
      desc: 'Verification audit trail', 
      path: '/attendance-report', 
      icon: <FaChartLine />, 
      color: 'from-indigo-600 to-violet-600',
      role: ['student', 'teacher', 'admin']
    }
  ];

  const userRole = user?.role?.toLowerCase() || 'student';
  const filteredItems = menuItems.filter(item => item.role.includes(userRole));

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 space-y-6 md:space-y-0">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <FaShapes className="animate-spin-slow" /> <span>Nexo Command Center</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-none">
              Control <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 font-black">Panel.</span>
            </h1>
            <p className="text-slate-500 font-medium text-base sm:text-lg max-w-xl">
              User: <span className="text-white font-bold">{user?.name || 'Operative'}</span> 
              {user?.rollno && <span className="ml-3 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">ID: {user.rollno}</span>}
              <br />
              Status: <span className="text-emerald-400 font-bold">Operational</span>
            </p>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none h-12 rounded-2xl bg-slate-900/50 border border-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white transition-all relative">
              <FaBell />
              <span className="absolute top-3 right-5 sm:right-3 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
            </button>
            <button 
              onClick={logout}
              className="flex-[2] md:flex-none px-6 py-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300"
            >
              Terminate Session
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {[
            { label: 'Security Level', value: 'High', icon: <FaShieldAlt className="text-emerald-400" /> },
            { label: 'Network status', value: 'Syncing', icon: <FaChartLine className="text-blue-400" /> },
            { label: 'Protocol', value: 'Biometric 2.0', icon: <FaShapes className="text-indigo-400" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/50 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-between">
              <div>
                <p className="text-[8px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-black text-white">{stat.value}</p>
              </div>
              <div className="text-xl sm:text-2xl p-3 sm:p-4 bg-slate-950/50 rounded-xl sm:rounded-2xl border border-white/5">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, i) => (
            <div 
              key={i}
              onClick={() => handleNavigate(item.path)}
              className="group relative cursor-pointer"
            >
              {/* Card Glow */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-[1.5rem] sm:rounded-[2.5rem] blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>
              
              <div className="relative h-full bg-[#0f172a]/50 backdrop-blur-2xl border border-slate-800/50 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 hover:border-slate-700/50 flex flex-col justify-between overflow-hidden shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute -right-4 -top-4 text-white/[0.02] text-7xl sm:text-9xl font-black transform rotate-12 group-hover:scale-110 transition-transform duration-700">
                  {item.icon}
                </div>

                <div className="space-y-4 sm:space-y-6 relative z-10">
                  <div className={`w-12 h-12 sm:w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl text-white shadow-xl transform group-hover:rotate-12 transition-transform duration-500`}>
                    {item.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2 tracking-tight group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 flex items-center text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                  Initialize Access <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-center sm:text-left">
          <p>© {new Date().getFullYear()} NEXO VISION. AEROSPACE GRADE INTERFACE.</p>
          <div className="flex space-x-4 sm:space-x-6">
            <span className="hover:text-blue-400 cursor-pointer">Protocol</span>
            <span className="hover:text-blue-400 cursor-pointer">Encryption</span>
            <span className="hover:text-blue-400 cursor-pointer">Support</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;