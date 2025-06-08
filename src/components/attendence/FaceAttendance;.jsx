import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FaceAttendance = () => {
  const webcamRef = useRef(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate();

  const captureAndRecognize = async () => {
    setIsLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    const base64Data = imageSrc?.split(',')[1];

    if (!base64Data) {
      alert('No image captured');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('https://nexovision-server.onrender.com/api/attendance/recognize', {
        imageBase64: base64Data,
      });
      setResult(res.data.message + (res.data.name ? ` (${res.data.name})` : ''+ res.data.rollno ? ` (${res.data.rollno})` : ''));
      // Redirect after successful recognition (optional)
      if (res.data.success) {
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err) {
      setResult(err.response?.data?.message || 'Recognition failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Face Recognition Attendance</h1>
          <p className="text-blue-100 mt-2">Position your face in the frame</p>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center">
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

            <button
              onClick={captureAndRecognize}
              disabled={isLoading}
              className={`mt-6 w-full max-w-xs flex justify-center items-center py-3 px-6 rounded-lg shadow-md text-white font-medium transition-all duration-200 ${
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
                  Processing...
                </>
              ) : (
                'Capture & Recognize'
              )}
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="bg-gray-50 rounded-lg p-4 h-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Results</h3>
              
              {capturedImage && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Captured Image:</h4>
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="rounded-lg border border-gray-200 w-full max-w-xs mx-auto"
                  />
                </div>
              )}

              {result && (
                <div className={`p-4 rounded-lg ${
                  result.includes('failed') 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  <p className="font-medium">{result}</p>
                  {result.includes('success') && (
                    <p className="mt-2 text-sm">You will be redirected shortly...</p>
                  )}
                </div>
              )}

              {!result && (
                <div className="text-center py-8 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l2-2m0 0l7-7 7 7M5 21v-7a2 2 0 012-2h10a2 2 0 012 2v7" />
                  </svg>
                  <p>Your attendance status will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Having trouble? <button className="text-blue-600 hover:text-blue-800 font-medium">Get help</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaceAttendance;