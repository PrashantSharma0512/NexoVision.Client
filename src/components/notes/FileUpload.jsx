import { useState, useRef } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { MdDelete } from "react-icons/md";

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'text/plain'
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(selectedFile.type)) {
        setMessage({ text: 'Only PDF, DOCX, DOC, and TXT files are allowed', type: 'error' });
        return;
      }
      
      if (selectedFile.size > maxSize) {
        setMessage({ text: 'File size must be less than 5MB', type: 'error' });
        return;
      }
      
      setFile(selectedFile);
      setMessage({ text: '', type: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ text: 'Please select a file first', type: 'error' });
      return;
    }
  
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('note', file);
  
    try {
      const res = await axios.post('https://nexovision-server.onrender.com/api/notes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      
      setMessage({ text: 'File uploaded successfully!', type: 'success' });
      onUpload(res.data.file);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Upload failed', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: [e.dataTransfer.files[0]] } });
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Notes</h2>
        <p className="text-gray-600 mb-6">Share your study materials with classmates</p>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 mb-4 ${
            file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <FiUploadCloud className="h-12 w-12 text-blue-500" />
            
            <div className="text-sm text-gray-600">
              {file ? (
                <div className="flex items-center justify-center space-x-2">
                  <p className="font-medium text-green-600 truncate max-w-xs">{file.name}</p>
                  <button 
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700"
                    title="Remove file"
                  >
                    <MdDelete size={30} />
                  </button>
                </div>
              ) : (
                <>
                  <p className="font-medium">Drag & drop files here</p>
                  <p className="text-xs mt-1">or</p>
                </>
              )}
            </div>
            
            <label className="cursor-pointer">
              <span className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                Browse Files
              </span>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.txt"
              />
            </label>
            
            <p className="text-xs text-gray-500">PDF, DOCX, or TXT (Max 5MB)</p>
          </div>
        </div>

        {uploading && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {message.text && (
          <div className={`p-3 rounded-md mb-4 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
            uploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : !file 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            'Upload Note'
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;