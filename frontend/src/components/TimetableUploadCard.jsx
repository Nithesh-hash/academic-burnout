import React, { useState, useEffect } from 'react';
import { timetableAPI } from '../api';
import { UploadCloud, CheckCircle, Image as ImageIcon } from 'lucide-react';

const TimetableUploadCard = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ has_timetable: false, timetable_url: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await timetableAPI.getStatus();
      setStatus(res.data);
    } catch (error) {
      console.error('Failed to fetch timetable status', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      await timetableAPI.uploadScreenshot(formData);
      await fetchStatus();
      setFile(null);
    } catch (error) {
      console.error('Upload failed', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 bg-slate-100 rounded-xl animate-pulse h-32"></div>;

  return (
    <div className="bg-white rounded-xl p-6 shadow-2xs border border-slate-200">
      <h3 className="text-xl font-extrabold text-slate-900 flex items-center mb-4 tracking-tight">
        <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
        Permanent Schedule
      </h3>
      
      {status.has_timetable ? (
        <div className="flex flex-col gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-emerald-500 mr-3" />
              <div>
                <p className="text-emerald-900 font-bold">Schedule Locked In</p>
                <p className="text-emerald-700 text-sm">Your baseline semester schedule is active.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStatus({ ...status, has_timetable: false })} className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md transition-colors text-sm font-semibold shadow-sm">
                Update
              </button>
              <a href={(import.meta.env.VITE_API_URL || '') + status.timetable_url} target="_blank" rel="noreferrer" className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-md transition-colors text-sm font-semibold">
                View
              </a>
            </div>
          </div>
          <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50 p-2 shadow-inner">
            {status.timetable_url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
              <img src={(import.meta.env.VITE_API_URL || '') + status.timetable_url} alt="My Timetable" className="max-w-full h-auto object-contain max-h-80 rounded shadow-sm" />
            ) : (
              <iframe src={(import.meta.env.VITE_API_URL || '') + status.timetable_url} title="My Timetable" className="w-full h-80 bg-white rounded shadow-sm" />
            )}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
          <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium mb-2">Upload your official semester timetable</p>
          <input 
            type="file" 
            accept="image/*,.pdf" 
            onChange={handleFileChange} 
            className="hidden" 
            id="timetable-upload" 
          />
          <label htmlFor="timetable-upload" className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors text-sm font-bold shadow-sm mb-3">
            Select File
          </label>
          {file && <p className="text-sm font-medium text-blue-600">{file.name}</p>}
          
          {file && (
            <button 
              onClick={handleUpload}
              className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-sm active:scale-95"
            >
              Confirm & Upload
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TimetableUploadCard;
