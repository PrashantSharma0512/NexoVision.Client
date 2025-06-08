import React, { useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import NotesList from './NotesList';
import { Tab } from '@headlessui/react';
import { getCurrentRole } from '../../utils/auth';

const NotesDashboard = () => {
  const [newFile, setNewFile] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = (fileData) => {
    setNewFile(fileData);
    setRefreshKey(prev => prev + 1); // Force refresh of NotesList
  };
  const [role, setRole] = useState('');

  useEffect(() => {
    const r = (getCurrentRole() || '').trim().toLowerCase();
    setRole(r);
    console.log('Detected role:', r);
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Study Materials Hub
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Upload, organize, and access all your course notes in one place
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {role && role != 'student' && (<Tab.Group>
            <Tab.List className="flex border-b border-gray-200">
              {['All Notes', 'My Uploads', 'Favorites'].map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    `px-6 py-4 text-sm font-medium focus:outline-none ${selected
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                  onClick={() => setActiveTab(tab.split(' ')[0].toLowerCase())}
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>)}

          < div className="p-6 md:p-8">
            {role && role != 'student' && (<div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upload New Notes</h2>
              <FileUpload onUpload={handleUploadSuccess} />
            </div>)}

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {activeTab === 'all' ? 'All' : activeTab === 'my' ? 'My' : 'Favorite'} Notes
              </h2>
              <NotesList
                key={refreshKey}
                newFile={newFile}
                filter={activeTab}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default NotesDashboard;