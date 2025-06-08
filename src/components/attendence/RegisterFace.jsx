import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterFace = () => {
  const [formData, setFormData] = useState({
    name: '',
    imageBase64: null,
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
      setMessage({ text: 'Please fill all fields and capture your image', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('https://nexovision-server.onrender.com/api/attendance/register', {
        name: formData.name,
        // email: `${formData.rollno}@faceapp.com`,
        // password: formData.password,
        imageBase64: base64Data,
        rollno: formData.rollno,
      });

      setMessage({ text: res.data.message, type: 'success' });
      // Redirect after 2 seconds if registration is successful
      setTimeout(() => navigate('/attendance'), 2000);
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Registration failed', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Student Face Registration</h1>
          <p className="text-blue-100 mt-2">Register your face for attendance system</p>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Webcam Section */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/png"
                width="100%"
                height="auto"
                className="rounded-lg shadow-md border-4 border-white"
                videoConstraints={{
                  facingMode: 'user',
                  width: { ideal: 640 },
                  height: { ideal: 480 }
                }}
              />
              <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none shadow-inner"></div>
            </div>

            {capturedImage && (
              <div className="mt-4 text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Captured Image:</h3>
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="rounded-lg border border-gray-200 w-32 h-32 object-cover mx-auto"
                />
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="rollno" className="block text-sm font-medium text-gray-700 mb-1">
                  Roll Number
                </label>
                <input
                  id="rollno"
                  name="rollno"
                  type="text"
                  placeholder="e.g., 2023001"
                  value={formData.rollno}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  required
                />
              </div>

              {/* <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
              </div> */}

              {message.text && (
                <div className={`p-3 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              <button
                onClick={captureAndRegister}
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-white font-medium transition-all duration-200 ${
                  isLoading 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  'Register Face'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already registered?{' '}
            <button 
              onClick={() => navigate('/attendance')} 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterFace;