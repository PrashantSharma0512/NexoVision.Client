import React, { useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import NotesList from './NotesList';
import { Tab } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';
import { FaBookOpen, FaCloudUploadAlt, FaFolderOpen, FaGraduationCap } from 'react-icons/fa';

const NotesDashboard = () => {
  const [newFile, setNewFile] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || '';

  const handleUploadSuccess = (fileData) => {
    setNewFile(fileData);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <FaGraduationCap /> <span>Academic Repository</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
              Study <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Vault.</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base max-w-xl">
              Access and manage military-grade educational resources and neural-mapped lecture notes.
            </p>
          </div>

          {role !== 'student' && (
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Faculty Controls</p>
                <p className="text-xs font-bold text-slate-400">Distribute Material</p>
              </div>
              <div className="flex-1 md:w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-blue-400 sm:flex-none">
                <FaCloudUploadAlt className="text-xl" />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <div className="bg-[#0f172a]/50 backdrop-blur-2xl border border-slate-800/50 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl">
              <Tab.Group onChange={(index) => {
                const tabs = ['all', 'my', 'favorites'];
                setActiveTab(tabs[index]);
              }}>
                <Tab.List className="flex bg-[#020617]/50 p-1.5 sm:p-2 m-3 sm:m-4 rounded-xl sm:rounded-2xl border border-slate-800/50">
                  {['Global Archive', 'My Curations', 'Bookmarked'].map((tab) => (
                    <Tab
                      key={tab}
                      className={({ selected }) =>
                        `flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 focus:outline-none ${
                          selected
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }`
                      }
                    >
                      {tab}
                    </Tab>
                  ))}
                </Tab.List>

                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black flex items-center">
                      <FaFolderOpen className="text-blue-500 mr-3" />
                      {activeTab === 'all' ? 'Universal Repository' : activeTab === 'my' ? 'Personal Assets' : 'Priority Notes'}
                    </h2>
                    <div className="h-[1px] flex-1 mx-6 bg-gradient-to-r from-slate-800 to-transparent"></div>
                  </div>

                  <NotesList
                    key={refreshKey}
                    newFile={newFile}
                    filter={activeTab}
                  />
                </div>
              </Tab.Group>
            </div>
          </div>

          {/* Sidebar / Upload Area */}
          <div className="lg:col-span-4 space-y-8">
            {role !== 'student' ? (
              <div className="sticky top-24">
                <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 backdrop-blur-3xl border border-blue-500/20 rounded-[2.5rem] p-8 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-blue-600 rounded-xl text-white">
                      <FaCloudUploadAlt className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-black text-white">Distribute Material</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Broadcast to students</p>
                    </div>
                  </div>
                  <FileUpload onUpload={handleUploadSuccess} />
                </div>
                
                <div className="mt-6 p-6 rounded-3xl bg-slate-900/40 border border-slate-800/50">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Repository Analytics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#020617] rounded-2xl border border-slate-800/50">
                      <p className="text-xl font-black">248</p>
                      <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Total Logs</p>
                    </div>
                    <div className="p-4 bg-[#020617] rounded-2xl border border-slate-800/50">
                      <p className="text-xl font-black text-emerald-400">1.2k</p>
                      <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Downloads</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#0f172a]/50 backdrop-blur-2xl border border-slate-800/50 rounded-[2.5rem] p-8">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-400">
                    <FaBookOpen className="text-3xl" />
                  </div>
                  <h3 className="text-xl font-black text-white">Student Portal</h3>
                  <p className="text-slate-500 text-sm font-medium">
                    As a student, you have read-only access to all departmental resources. New materials will appear in your "Global Archive".
                  </p>
                  <div className="pt-4 border-t border-slate-800/50 text-[10px] text-slate-600 font-black uppercase tracking-widest">
                    Version 2.0 Academic Suite
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesDashboard;