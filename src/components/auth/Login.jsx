import React, { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/login', form);
      const userData = {
        token: res.data.token,
        role: res.data.role,
        name: res.data.name || form.email.split('@')[0],
        rollno: res.data.rollno
      };
      login(userData);
      setMessage('Login successful');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="w-full max-w-md relative z-10 transition-all duration-500 hover:scale-[1.01]">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <h1 className="text-4xl font-black text-white tracking-tight">NexoVision</h1>
            <p className="text-blue-100 mt-2 font-medium">Secure Access Portal</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {message && (
              <div className={`p-4 rounded-xl text-center text-sm font-semibold transition-all duration-300 ${
                message.includes('success') 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {message}
              </div>
            )}
            
            <div className="space-y-5">
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-blue-400">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-600"
                />
              </div>
              
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-blue-400">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-600"
                />
              </div>
              
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-blue-400">
                  User Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="student" className="bg-[#1e293b]">Student</option>
                    <option value="teacher" className="bg-[#1e293b]">Teacher</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full group relative flex justify-center py-4 px-4 border border-transparent rounded-xl text-md font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/25 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'}`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-gray-400">
              New to NexoVision?{' '}
              <a href="/register" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                Create an Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;