import { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { FiDownload, FiTrash2, FiSearch, FiFile, FiFileText, FiFileMinus } from 'react-icons/fi';
import { FaFilePdf, FaFileWord } from 'react-icons/fa';

const NotesList = ({ newFile, filter }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/notes?filter=${filter}`);
      setNotes(response.data.files);
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [newFile, filter]);

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`/api/notes/download/${filename}`, {
        responseType: 'blob'
      });
      saveAs(new Blob([response.data]), filename);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await axios.delete(`/api/notes/${filename}`);
      fetchNotes();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    const filenameA = a.filename.toLowerCase();
    const filenameB = b.filename.toLowerCase();
    
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc' 
        ? filenameA.localeCompare(filenameB)
        : filenameB.localeCompare(filenameA);
    }
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.uploadedAt) - new Date(b.uploadedAt)
        : new Date(b.uploadedAt) - new Date(a.uploadedAt);
    }
    return 0;
  });

  const filteredNotes = sortedNotes.filter(note => {
    return note.filename.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch(ext) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-xl" />;
      case 'docx':
      case 'doc': return <FaFileWord className="text-blue-500 text-xl" />;
      case 'txt': return <FiFileText className="text-gray-500 text-xl" />;
      default: return <FiFile className="text-gray-400 text-xl" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Study Materials</h2>
          
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FiFileMinus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No notes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Upload some notes to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      File Name
                      {sortConfig.key === 'name' && (
                        <span className={`ml-1 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Upload Date
                      {sortConfig.key === 'date' && (
                        <span className={`ml-1 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotes.map((note, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(note.filename)}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {note.filename}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(note.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(note.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                      {note.filename.split('.').pop()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleDownload(note.filename)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Download"
                      >
                        <FiDownload className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.filename)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;