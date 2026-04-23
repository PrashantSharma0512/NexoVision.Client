import { useState, useRef } from 'react';
import api from '../../utils/api';
import { FiUploadCloud, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { MdDelete } from "react-icons/md";

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [meta, setMeta] = useState({ subject: '', code: '' });
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
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(selectedFile.type)) {
        setMessage({ text: 'Neural compatibility error: Use PDF/DOCX/TXT', type: 'error' });
        return;
      }
      
      if (selectedFile.size > maxSize) {
        setMessage({ text: 'Payload too large: Max 10MB', type: 'error' });
        return;
      }
      
      setFile(selectedFile);
      setMessage({ text: '', type: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ text: 'Target file not selected', type: 'error' });
      return;
    }
  
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('note', file);
    formData.append('subject', meta.subject);
    formData.append('subject_code', meta.code);
  
    try {
      const res = await api.post('/api/notes/upload', formData, {
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
      
      setMessage({ text: 'Transmission successful: File synced', type: 'success' });
      onUpload(res.data.file);
      setFile(null);
      setMeta({ subject: '', code: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.error || 'Uplink failure: Connection lost', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Subject Title</label>
          <input 
            type="text" 
            placeholder="e.g. Quantum Computing"
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={meta.subject}
            onChange={(e) => setMeta({...meta, subject: e.target.value})}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">ID Code</label>
          <input 
            type="text" 
            placeholder="QC-401"
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={meta.code}
            onChange={(e) => setMeta({...meta, code: e.target.value})}
          />
        </div>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 group ${
          file 
          ? 'border-emerald-500/50 bg-emerald-500/5' 
          : 'border-slate-800 hover:border-blue-500/50 hover:bg-blue-600/5'
        }`}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => {
          e.preventDefault(); e.stopPropagation();
          if (e.dataTransfer.files?.[0]) handleFileChange({ target: { files: [e.dataTransfer.files[0]] } });
        }}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-2xl ${file ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-600/10'} transition-all`}>
            {file ? <FiCheck size={24} /> : <FiUploadCloud size={24} />}
          </div>
          
          <div className="space-y-1">
            {file ? (
              <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700/50">
                <span className="text-xs font-bold text-white truncate max-w-[150px]">{file.name}</span>
                <button onClick={() => setFile(null)} className="text-rose-500 hover:scale-110 transition-transform">
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm font-black text-white">Initialize Upload</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Drag or Browse Surface</p>
              </>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.doc,.docx,.txt"
          />
          {!file && (
            <button 
              onClick={() => fileInputRef.current.click()}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
            >
              Select Payload
            </button>
          )}
        </div>
      </div>

      {uploading && (
        <div className="space-y-2 px-2">
          <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span>Syncing Data...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {message.text && (
        <div className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center space-x-3 ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {message.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
          <span>{message.text}</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className={`w-full group relative flex items-center justify-center py-5 rounded-2xl font-black tracking-[0.2em] uppercase text-xs transition-all duration-300 shadow-2xl ${
          uploading 
            ? 'bg-slate-800 text-slate-600' 
            : !file 
              ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed uppercase' 
              : 'bg-blue-600 text-white hover:bg-blue-500 hover:-translate-y-1 shadow-blue-500/20'
        }`}
      >
        {uploading ? 'Processing Signal...' : 'Execute Sync'}
      </button>
    </div>
  );
};

export default FileUpload;