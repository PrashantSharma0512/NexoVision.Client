import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaFingerprint, FaShieldAlt, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const FaceAttendance = () => {
  const webcamRef = useRef(null);
  const [result, setResult] = useState({ message: '', type: '', name: '', rollno: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate();

  const captureAndRecognize = async () => {
    setIsLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    const base64Data = imageSrc?.split(',')[1];

    if (!base64Data) {
      setResult({ message: 'Optical capture failed', type: 'error' });
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post('/api/attendance/recognize', {
        imageBase64: base64Data,
      });
      
      setResult({
        message: res.data.message,
        type: res.data.success || !res.data.message.includes('failed') ? 'success' : 'error',
        name: res.data.name,
        rollno: res.data.rollno
      });

      if (res.data.success || !res.data.message.includes('failed')) {
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err) {
      setResult({ 
        message: err.response?.data?.message || 'Neural verification failed', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b,0%,#020617_70%)] opacity-50"></div>
      
      <div className="w-full max-w-4xl relative z-10 transition-all duration-700">
        <div className="bg-[#0f172a]/40 backdrop-blur-3xl border border-slate-800/50 rounded-[2rem] sm:rounded-[3rem] shadow-2xl p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-6">
              <FaShieldAlt className="mr-2" /> Encrypted Verification
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-2">GateKeeper AI</h1>
            <p className="text-slate-500 font-medium text-xs sm:text-base tracking-wide">Optical biometric scan for institutional access</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Scanner Canvas */}
            <div className="relative group w-full max-w-sm mx-auto lg:max-w-none">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] sm:rounded-[2.5rem] blur opacity-20 animate-pulse"></div>
              <div className="relative aspect-square rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-2 border-slate-800 bg-[#020617] shadow-inner">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/png"
                  className="w-full h-full object-cover grayscale-[30%]"
                  videoConstraints={{ facingMode: 'user' }}
                />
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-64 h-64 border border-blue-500/30 rounded-full animate-[ping_3s_linear_infinite]"></div>
                  <div className="absolute inset-0 border-[20px] border-[#020617] rounded-[2.5rem]"></div>
                  <div className="w-48 h-48 border-2 border-dashed border-blue-400/20 rounded-full animate-spin-slow"></div>
                  
                  {/* Scanning Line */}
                  <div className="absolute w-full h-[1px] bg-blue-400 shadow-[0_0_15px_#60a5fa] animate-[scan_2.5s_ease-in-out_infinite]"></div>
                </div>
              </div>
            </div>

            {/* Status Panel */}
            <div className="space-y-8">
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 min-h-[300px] flex flex-col">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                  Verification Log
                </h3>

                {capturedImage && (
                  <div className="mb-6 flex items-center space-x-4 p-4 bg-[#020617] border border-slate-800 rounded-2xl">
                    <img src={capturedImage} className="w-12 h-12 rounded-lg object-cover ring-2 ring-slate-800" alt="Capture" />
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                      Latent Capture <br />
                      <span className="text-blue-400">Processed</span>
                    </div>
                  </div>
                )}

                {result.message ? (
                  <div className={`mt-auto p-6 rounded-2xl border flex items-start space-x-4 animate-in zoom-in-95 duration-300 ${
                    result.type === 'success' 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                  }`}>
                    <div className="text-2xl mt-1">
                      {result.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    </div>
                    <div>
                      <p className="font-black text-lg leading-tight mb-1">{result.message}</p>
                      {result.name && <p className="text-xs opacity-70 font-bold">Identified: {result.name} ({result.rollno})</p>}
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
                    <FaFingerprint className="text-4xl text-slate-800 mx-auto mb-4" />
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Awaiting Biometric Data</p>
                  </div>
                )}
              </div>

              <button
                onClick={captureAndRecognize}
                disabled={isLoading}
                className={`w-full group relative flex items-center justify-center py-6 px-8 rounded-3xl font-black tracking-[0.2em] uppercase text-sm shadow-2xl transition-all duration-500 ${
                  isLoading 
                    ? 'bg-slate-800 text-slate-600' 
                    : 'bg-white text-[#020617] hover:scale-[1.02] active:scale-95 shadow-white/5'
                }`}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin text-2xl" />
                ) : (
                  'Initiate Verification'
                )}
              </button>
              
              <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                Protected by NexoVision Neural Core
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceAttendance;