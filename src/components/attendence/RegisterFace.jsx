import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaUserTag, FaIdCard, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const RegisterFace = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollno: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const captureAndRegister = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    const base64Data = imageSrc?.split(',')[1];

    if (!formData.name || !formData.rollno || !base64Data) {
      setMessage({ text: 'Please complete all fields and capture your image', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/api/attendance/register', {
        name: formData.name,
        imageBase64: base64Data,
        rollno: formData.rollno,
      });

      setMessage({ text: res.data.message || 'Face registered successfully!', type: 'success' });
      setTimeout(() => navigate('/attendance'), 2000);
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Biometric registration failed', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-5xl relative z-10 transition-all duration-500">
        <div className="bg-[#0f172a]/80 backdrop-blur-3xl border border-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Visual Section */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/50">
              <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                <div className="p-2 sm:p-3 bg-blue-600/20 rounded-xl sm:rounded-2xl text-blue-400">
                  <FaCamera className="text-xl sm:text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">Biometric Capture</h2>
                  <p className="text-slate-500 text-[10px] sm:text-sm font-medium uppercase tracking-[0.2em]">Neural Enrollment v2.4</p>
                </div>
              </div>

              <div className="relative group w-full max-w-md mx-auto lg:max-w-none">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[1.5rem] sm:rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-[#020617] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border-2 border-slate-800 shadow-2xl aspect-video flex items-center justify-center">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/png"
                    className="w-full h-full object-cover grayscale-[20%] brightness-110"
                    videoConstraints={{ facingMode: 'user' }}
                  />
                  {/* Scanner Overlay UI */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-8 sm:w-12 h-8 sm:h-12 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-blue-500/50 rounded-tl-lg sm:rounded-tl-xl"></div>
                    <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-8 sm:w-12 h-8 sm:h-12 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-blue-500/50 rounded-tr-lg sm:rounded-tr-xl"></div>
                    <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-8 sm:w-12 h-8 sm:h-12 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-blue-500/50 rounded-bl-lg sm:rounded-bl-xl"></div>
                    <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-8 sm:w-12 h-8 sm:h-12 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-blue-500/50 rounded-br-lg sm:rounded-br-xl"></div>
                    <div className="absolute top-1/2 left-0 w-full h-[1px] sm:h-[2px] bg-blue-500/20 animate-[scan_3s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex items-center justify-between">
                <div className="flex space-x-3 sm:space-x-4">
                  {capturedImage && (
                    <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-lg sm:rounded-2xl overflow-hidden border border-blue-500/50 shadow-lg shadow-blue-500/20">
                      <img src={capturedImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <FaCheckCircle className="text-white text-xs sm:text-sm" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-[9px] sm:text-xs text-slate-500 font-bold max-w-[150px] sm:max-w-[200px] text-right">
                  Ensure face is clearly visible and centered.
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-12 flex flex-col justify-center space-y-6 sm:space-y-8">
              <div className="space-y-1 sm:space-y-2 text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white">Enroll Profile</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">Map biometric signature to credentials.</p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="group text-left">
                  <label className="flex items-center text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 sm:mb-3 group-focus-within:text-blue-400 transition-colors">
                    <FaUserTag className="mr-2" /> Identity Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. PRASHANT SHARMA"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700/50 text-white px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-700 font-bold text-sm sm:text-base"
                  />
                </div>

                <div className="group text-left">
                  <label className="flex items-center text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 sm:mb-3 group-focus-within:text-blue-400 transition-colors">
                    <FaIdCard className="mr-2" /> Ledger ID (Roll)
                  </label>
                  <input
                    name="rollno"
                    type="text"
                    placeholder="e.g. 2023CS101"
                    value={formData.rollno}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700/50 text-white px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-700 font-bold text-sm sm:text-base"
                  />
                </div>

                {message.text && (
                  <div className={`p-4 rounded-xl sm:rounded-2xl border text-[10px] sm:text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
                    message.type === 'success' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  onClick={captureAndRegister}
                  disabled={isLoading}
                  className={`w-full group relative flex items-center justify-center py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl font-black tracking-widest uppercase text-xs sm:text-sm shadow-2xl transition-all duration-300 ${
                    isLoading 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-500 hover:to-indigo-600 hover:-translate-y-1 shadow-blue-500/20'
                  }`}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin text-xl" />
                  ) : (
                    'Enroll Biometrics'
                  )}
                </button>
              </div>

              <div className="pt-4 sm:pt-6 text-center">
                <button 
                  onClick={() => navigate('/attendance')}
                  className="text-slate-500 hover:text-blue-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-colors"
                >
                  Verify Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterFace;