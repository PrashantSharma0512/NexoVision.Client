import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { FaCalendarCheck, FaUserCheck, FaClock, FaCalendarDay, FaFileAlt } from 'react-icons/fa';

const AttendanceReport = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || '';

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const url = role === 'student' ? `/api/attendance/report?rollno=${user.rollno}` : '/api/attendance/report';
        const res = await api.get(url);
        setRecords(res.data.records);
      } catch (err) {
        console.error('Failed to fetch attendance records', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchAttendance();
  }, [user, role]);

  const stats = [
    { label: 'Total Present', value: records.length, color: 'text-emerald-400' },
    { label: 'System Uptime', value: '100%', color: 'text-blue-400' },
    { label: 'Verification Method', value: 'Biometric', color: 'text-indigo-400' },
    { label: 'Security Level', value: 'AES-256', color: 'text-slate-400' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <FaCalendarCheck /> <span>Biometric Ledger</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
              Presence <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Ledger.</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base max-w-xl">
              Real-time audit trail of cryptographic biometric verifications and institutional access.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl">
              <p className={stat.color + " text-xl sm:text-2xl font-black mb-1"}>{stat.value}</p>
              <p className="text-[8px] sm:text-[10px] text-slate-500 uppercase font-black tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main List */}
        <div className="bg-[#0f172a]/50 backdrop-blur-3xl border border-slate-800/50 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-6 md:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 space-y-4 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-black flex items-center">
                <FaFileAlt className="text-emerald-500 mr-4" />
                Access Logs
              </h2>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Nodes: {records.length} Active
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">polling data nodes...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[2rem] bg-[#020617]/30">
                <FaCalendarDay className="mx-auto text-4xl text-slate-800 mb-4" />
                <p className="text-white font-black">No Presence Detected</p>
                <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-widest">Execute biometric scan to begin enrollment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identity Index</th>
                      <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Time-Stamp</th>
                      <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Binary Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {records.map((record, i) => (
                      <tr key={i} className="group hover:bg-emerald-500/5 transition-colors">
                        <td className="py-6 pr-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                              <FaUserCheck />
                            </div>
                            <div>
                              <p className="text-white font-black text-sm uppercase">{record.rollno}</p>
                              <p className="text-[9px] text-slate-600 font-black tracking-widest">VERIFIED ID</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6">
                          <div className="flex items-center text-slate-400 text-sm font-bold space-x-3">
                            <FaClock className="text-slate-600" />
                            <span>{new Date(record.date).toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-6">
                          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
