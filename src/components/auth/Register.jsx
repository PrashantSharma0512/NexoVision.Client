import React, { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    role: 'student' 
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/register', form);
      setMessage(res.data.message || 'Registration successful');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px]"></div>
      
      <div className="w-full max-w-lg relative z-10 transition-all duration-500 hover:scale-[1.01]">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-center border-b border-white/10">
            <h1 className="text-4xl font-black text-white tracking-tight">Join NexoVision</h1>
            <p className="text-indigo-200 mt-2 font-medium">Create your secure identification profile</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {message && (
              <div className={`p-4 rounded-xl text-center text-sm font-semibold transition-all duration-300 ${
                message.includes('success') 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-indigo-400">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 placeholder:text-gray-600"
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-indigo-400">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 placeholder:text-gray-600"
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-indigo-400">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+91 0000000000"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 placeholder:text-gray-600"
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-indigo-400">
                  Select Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="student" className="bg-[#1e293b]">Student</option>
                    <option value="teacher" className="bg-[#1e293b]">Teacher</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="group md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-indigo-400">
                  Secure Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 placeholder:text-gray-600"
                />
                <p className="mt-2 text-[10px] text-gray-500 font-medium">Use 8+ characters with a mix of letters, numbers & symbols</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                required
                className="w-4 h-4 rounded border-gray-700 bg-white/5 text-indigo-600 focus:ring-indigo-500/50 transition-all"
              />
              <label className="text-sm text-gray-400">
                I agree to the <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-4 border border-transparent rounded-xl text-md font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/20 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Initializing Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-gray-400">
              Already part of the network?{' '}
              <a href="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;