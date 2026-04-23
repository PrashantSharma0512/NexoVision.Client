import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { saveAs } from 'file-saver';
import { FiDownload, FiTrash2, FiSearch, FiFileText, FiFile, FiClock, FiUser, FiInfo } from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaSort } from 'react-icons/fa';

const NotesList = ({ newFile, filter }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/notes?filter=${filter}`);
      setNotes(response.data.files);
    } catch (err) {
      console.error('Signal lost: Error fetching notes archive', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [newFile, filter]);

  const handleDownload = async (filename, originalName) => {
    try {
      const response = await api.get(`/api/notes/download/${filename}`, {
        responseType: 'blob'
      });
      saveAs(new Blob([response.data]), originalName || filename);
    } catch (err) {
      console.error('Download sequence failed', err);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm('Confirm permanent deletion of this asset from neural vault?')) return;
    
    try {
      await api.delete(`/api/notes/${filename}`);
      fetchNotes();
    } catch (err) {
      console.error('Deletion protocol failed', err);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop().toLowerCase();
    switch(ext) {
      case 'pdf': return <FaFilePdf className="text-rose-500" />;
      case 'docx':
      case 'doc': return <FaFileWord className="text-blue-500" />;
      case 'txt': return <FiFileText className="text-slate-400" />;
      default: return <FiFile className="text-slate-500" />;
    }
  };

  // Modern Filter & Sort Logic
  const processedNotes = [...notes]
    .filter(note => 
      note.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Dynamic Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Filter by subject or filename..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full bg-slate-900/30 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-white placeholder:text-slate-600 transition-all shadow-inner"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Mapping Neural Nodes...</p>
        </div>
      ) : processedNotes.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-slate-800/50 border-dashed">
          <FiInfo className="mx-auto text-4xl text-slate-800 mb-4" />
          <h3 className="text-white font-black">No Records Found</h3>
          <p className="text-slate-500 text-xs font-medium max-w-xs mx-auto mt-2">
            The encrypted archive returned no matches for your current query.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-800/50">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#020617] border-b border-slate-800">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                  <div className="flex items-center">Resource Identifier <FaSort className="ml-2 opacity-30" /></div>
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden md:table-cell">Subject</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest hidden lg:table-cell">Temporal Mark</th>
                <th className="px-6 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {processedNotes.map((note) => (
                <tr key={note._id} className="hover:bg-blue-600/5 transition-colors group">
                  <td className="px-6 py-6 font-bold text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl p-3 bg-slate-900/50 rounded-xl border border-slate-800 group-hover:border-blue-500/30 transition-all">
                        {getFileIcon(note.file_name)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-white truncate lg:max-w-xs">{note.file_name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                          {(note.size / (1024 * 1024)).toFixed(2)} MB • Neural Native
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 hidden md:table-cell">
                    <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-700/50">
                      {note.subject || 'Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-6 hidden lg:table-cell">
                    <div className="flex items-center text-slate-500 text-xs font-bold">
                      <FiClock className="mr-2" />
                      {new Date(note.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => handleDownload(note.filename, note.file_name)}
                        className="w-10 h-10 flex items-center justify-center bg-blue-600/10 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-600/10"
                        title="Download Asset"
                      >
                        <FiDownload />
                      </button>
                      <button
                        onClick={() => handleDelete(note.filename)}
                        className="w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                        title="Erase Record"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NotesList;