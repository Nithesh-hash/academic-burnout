import React, { useState } from 'react';
import { X, Calendar, Clock, Moon, Monitor, BookOpen, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
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

  const handlePresetHealthy = () => {
    setFormData({
      date: todayStr,
      study_hours: 4.5,
      assignment_completion_status: 'Completed',
      assignment_delay: 0,
      attendance: 96.0,
      workload: 3,
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
      sleep_duration: 4.0,
      screen_time: 8.5,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Log Daily Behaviour Parameters</h3>
            <p className="text-xs text-slate-300">Privacy-Friendly Daily Academic & Lifestyle Entry</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
          <div className="flex items-center justify-between bg-blue-50/70 p-3 rounded-xl border border-blue-100">
            <span className="text-xs font-semibold text-blue-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Quick Demo Fill Presets:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePresetHealthy}
                className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold transition-colors"
              >
                Healthy Routine
              </button>
              <button
                type="button"
                onClick={handlePresetStress}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-semibold transition-colors"
              >
                High Stress Routine
              </button>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Entry Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Section 1: Academic Parameters */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Academic Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Study Hours */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Daily Study Hours</span>
                  <span className="font-bold text-blue-600">{formData.study_hours} hrs</span>
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
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Attendance Percentage</span>
                  <span className="font-bold text-emerald-600">{formData.attendance}%</span>
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
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Assignment Completion Status</label>
                <select
                  name="assignment_completion_status"
                  value={formData.assignment_completion_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Completed">Completed On-Time</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Delayed">Delayed / Overdue</option>
                </select>
              </div>

              {/* Assignment Delay Days */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Assignment Delay (Days)</span>
                  <span className="font-bold text-amber-600">{formData.assignment_delay} days</span>
                </div>
                <input
                  type="number"
                  name="assignment_delay"
                  min="0"
                  max="14"
                  value={formData.assignment_delay}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              {/* Workload Level */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Perceived Workload Level (1 = Low, 5 = Extreme)</span>
                  <span className="font-bold text-purple-600">Level {formData.workload} / 5</span>
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
                <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                  <span>Light</span>
                  <span>Moderate</span>
                  <span>Heavy</span>
                  <span>Overwhelming</span>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Lifestyle Parameters */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-600" />
              Lifestyle Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sleep Duration */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Sleep Duration</span>
                  <span className="font-bold text-indigo-600">{formData.sleep_duration} hrs</span>
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
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Non-Academic Screen Time</span>
                  <span className="font-bold text-purple-600">{formData.screen_time} hrs</span>
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

              {/* Break Frequency */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Daily Rest / Break Frequency</span>
                  <span className="font-bold text-slate-700">{formData.break_frequency} breaks/day</span>
                </div>
                <input
                  type="number"
                  name="break_frequency"
                  min="0"
                  max="15"
                  value={formData.break_frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Analyzing with AI...' : 'Save & Analyze Risk'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LogBehaviourModal;
