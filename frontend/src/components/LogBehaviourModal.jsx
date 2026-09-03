import React, { useState } from 'react';
import { X, Calendar, Clock, Moon, Monitor, BookOpen, AlertCircle, Sparkles, CheckCircle2, Coffee, Layers, Plus, Minus, FileText } from 'lucide-react';
import { behaviourAPI } from '../api';

const LogBehaviourModal = ({ isOpen, onClose, onSuccess }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: todayStr,
    study_hours: 4.0,
    assignment_completion_status: 'Completed',
    assignment_delay: 0,
    attendance: 95.0,
    workload: 3,
    sleep_duration: 7.5,
    screen_time: 3.5,
    break_frequency: 3
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || type === 'range' ? parseFloat(value) : value
    }));
  };

  const handleAdjustValue = (field, delta, min, max, step = 1) => {
    setFormData(prev => {
      const current = parseFloat(prev[field]) || 0;
      const next = Math.min(max, Math.max(min, Math.round((current + delta) * 10) / 10));
      return { ...prev, [field]: next };
    });
  };

  const handlePresetHealthy = () => {
    setFormData({
      date: todayStr,
      study_hours: 4.5,
      assignment_completion_status: 'Completed',
      assignment_delay: 0,
      attendance: 96.0,
      workload: 2,
      sleep_duration: 7.8,
      screen_time: 3.2,
      break_frequency: 4
    });
  };

  const handlePresetStress = () => {
    setFormData({
      date: todayStr,
      study_hours: 1.5,
      assignment_completion_status: 'Delayed',
      assignment_delay: 3,
      attendance: 70.0,
      workload: 5,
      sleep_duration: 4.2,
      screen_time: 8.0,
      break_frequency: 1
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await behaviourAPI.logBehaviour(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit daily behaviour entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-600/30 text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Log Daily Behaviour Parameters</h3>
              <p className="text-xs text-slate-400">Standardized Academic & Lifestyle Input Controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Fill Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-blue-50/70 p-3 rounded-xl border border-blue-100 gap-2">
            <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Demo Routine Presets:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePresetHealthy}
                className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition-colors"
              >
                Healthy Routine
              </button>
              <button
                type="button"
                onClick={handlePresetStress}
                className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-bold transition-colors"
              >
                High Stress Routine
              </button>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Record Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Section 1: Academic Parameters */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Academic Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Study Hours */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Daily Study Hours</span>
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('study_hours', -0.5, 0, 14, 0.5)}
                      className="text-slate-400 hover:text-blue-600 p-0.5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-extrabold text-blue-600 font-mono text-xs px-1">
                      {formData.study_hours}h
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('study_hours', 0.5, 0, 14, 0.5)}
                      className="text-slate-400 hover:text-blue-600 p-0.5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  name="study_hours"
                  min="0"
                  max="14"
                  step="0.5"
                  value={formData.study_hours}
                  onChange={handleChange}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Attendance */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Attendance %</span>
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('attendance', -5, 0, 100, 1)}
                      className="text-slate-400 hover:text-emerald-600 p-0.5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-extrabold text-emerald-600 font-mono text-xs px-1">
                      {formData.attendance}%
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('attendance', 5, 0, 100, 1)}
                      className="text-slate-400 hover:text-emerald-600 p-0.5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  name="attendance"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.attendance}
                  onChange={handleChange}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Assignment Completion Status */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="block text-xs font-bold text-slate-700">Assignment Status</label>
                <select
                  name="assignment_completion_status"
                  value={formData.assignment_completion_status}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Completed">Completed On-Time</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Delayed">Delayed / Overdue</option>
                </select>
              </div>

              {/* Standardized Assignment Delay Slider & Counter Controls */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Assignment Delay</span>
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('assignment_delay', -1, 0, 14, 1)}
                      className="text-slate-400 hover:text-amber-600 p-0.5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-extrabold text-amber-600 font-mono text-xs px-1">
                      {formData.assignment_delay} {formData.assignment_delay === 1 ? 'day' : 'days'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('assignment_delay', 1, 0, 14, 1)}
                      className="text-slate-400 hover:text-amber-600 p-0.5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  name="assignment_delay"
                  min="0"
                  max="14"
                  step="1"
                  value={formData.assignment_delay}
                  onChange={handleChange}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Workload Level */}
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Perceived Workload Pressure</span>
                  <span className="font-extrabold text-purple-600 font-mono text-xs bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    Level {formData.workload} / 5
                  </span>
                </div>
                <input
                  type="range"
                  name="workload"
                  min="1"
                  max="5"
                  step="1"
                  value={formData.workload}
                  onChange={handleChange}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                  <span>1 - Light</span>
                  <span>2 - Normal</span>
                  <span>3 - Moderate</span>
                  <span>4 - Heavy</span>
                  <span>5 - Extreme</span>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Lifestyle Parameters */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-600" />
              Lifestyle & Rest Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Sleep Duration */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Sleep Duration</span>
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('sleep_duration', -0.5, 0, 14, 0.5)}
                      className="text-slate-400 hover:text-indigo-600 p-0.5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-extrabold text-indigo-600 font-mono text-xs px-1">
                      {formData.sleep_duration}h
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('sleep_duration', 0.5, 0, 14, 0.5)}
                      className="text-slate-400 hover:text-indigo-600 p-0.5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  name="sleep_duration"
                  min="0"
                  max="14"
                  step="0.5"
                  value={formData.sleep_duration}
                  onChange={handleChange}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Screen Time */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Recreational Screen Time</span>
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('screen_time', -0.5, 0, 16, 0.5)}
                      className="text-slate-400 hover:text-purple-600 p-0.5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-extrabold text-purple-600 font-mono text-xs px-1">
                      {formData.screen_time}h
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('screen_time', 0.5, 0, 16, 0.5)}
                      className="text-slate-400 hover:text-purple-600 p-0.5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  name="screen_time"
                  min="0"
                  max="16"
                  step="0.5"
                  value={formData.screen_time}
                  onChange={handleChange}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Standardized Daily Rest / Break Frequency */}
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5 text-teal-600" />
                    Daily Rest & Break Frequency
                  </span>
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('break_frequency', -1, 0, 8, 1)}
                      className="text-slate-400 hover:text-teal-600 p-0.5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-extrabold text-teal-600 font-mono text-xs px-1">
                      {formData.break_frequency} {formData.break_frequency === 1 ? 'break/day' : 'breaks/day'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('break_frequency', 1, 0, 8, 1)}
                      className="text-slate-400 hover:text-teal-600 p-0.5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  name="break_frequency"
                  min="0"
                  max="8"
                  step="1"
                  value={formData.break_frequency}
                  onChange={handleChange}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Processing AI Assessment...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Entry & Compute Risk</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LogBehaviourModal;
