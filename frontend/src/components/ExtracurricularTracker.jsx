import React, { useState, useEffect } from 'react';
import { extracurricularAPI } from '../api';
import { Activity, Plus, Trash2, Clock } from 'lucide-react';

const ExtracurricularTracker = () => {
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({ name: '', day_of_week: 'Monday', duration_hours: '', type: 'Club' });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await extracurricularAPI.getAll();
      setActivities(res.data);
    } catch (error) {
      console.error('Failed to fetch activities', error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await extracurricularAPI.create({ ...formData, duration_hours: parseFloat(formData.duration_hours) });
      setFormData({ name: '', day_of_week: 'Monday', duration_hours: '', type: 'Club' });
      fetchActivities();
    } catch (error) {
      console.error('Failed to create activity', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await extracurricularAPI.delete(id);
      fetchActivities();
    } catch (error) {
      console.error('Failed to delete activity', error);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-2xs border border-slate-200">
      <h3 className="text-xl font-extrabold text-slate-900 flex items-center mb-4 tracking-tight">
        <Activity className="w-5 h-5 mr-2 text-purple-600" />
        Extracurricular Commitments
      </h3>

      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <input 
          type="text" 
          placeholder="Activity Name" 
          required
          className="bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
        />
        <select 
          className="bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={formData.day_of_week} onChange={e => setFormData({...formData, day_of_week: e.target.value})}
        >
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <input 
          type="number" 
          placeholder="Hours/Week" 
          step="0.5" min="0" required
          className="bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={formData.duration_hours} onChange={e => setFormData({...formData, duration_hours: e.target.value})}
        />
        <select 
          className="bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
        >
          {['Club', 'Sport', 'Hobby', 'Work', 'Other'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button type="submit" className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 transition-all font-bold shadow-sm active:scale-95">
          <Plus className="w-4 h-4 mr-1" /> Add
        </button>
      </form>

      <div className="space-y-2">
        {activities.length === 0 ? (
          <p className="text-slate-400 text-center py-4 text-sm font-medium">No extracurriculars added yet.</p>
        ) : (
          activities.map(act => (
            <div key={act.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-purple-300 transition-colors">
              <div>
                <p className="text-slate-800 font-bold">{act.name} <span className="text-xs text-purple-700 ml-2 px-2 py-0.5 bg-purple-100 rounded-full">{act.type}</span></p>
                <div className="flex items-center text-xs text-slate-500 mt-1 font-medium">
                  <span className="mr-3">{act.day_of_week}</span>
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {act.duration_hours} hrs</span>
                </div>
              </div>
              <button onClick={() => handleDelete(act.id)} className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExtracurricularTracker;
