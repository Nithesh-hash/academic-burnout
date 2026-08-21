import React from 'react';
import { UserCheck, Moon, Clock, Monitor, BookOpen, Layers, CheckCircle } from 'lucide-react';

const PersonalBaselineCard = ({ baseline = {}, studentName = 'Student' }) => {
  const {
    sleep_hours = 7.5,
    study_hours = 4.0,
    screen_time = 3.5,
    workload = 3.0,
    attendance = 92.0,
    assignment_delay = 0.0,
    record_count = 0
  } = baseline;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Personal Baseline Pattern</h3>
            <p className="text-xs text-slate-500">Calculated normal routine for {studentName}</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          {record_count > 0 ? `${record_count} Records Analyzed` : 'Standard Default Baseline'}
        </span>
      </div>

      <p className="text-xs text-slate-600 mb-4">
        The system continuously updates your normal lifestyle baseline. Future behaviour inputs are compared against these personalized historic averages:
      </p>

      {/* Grid of baseline parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Sleep */}
        <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-700 mb-1">
            <span className="text-xs font-semibold">Normal Sleep</span>
            <Moon className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold text-slate-900">{sleep_hours} <span className="text-xs font-normal text-slate-500">hrs/day</span></span>
        </div>

        {/* Study */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-xs font-semibold">Normal Study</span>
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold text-slate-900">{study_hours} <span className="text-xs font-normal text-slate-500">hrs/day</span></span>
        </div>

        {/* Screen */}
        <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-700 mb-1">
            <span className="text-xs font-semibold">Normal Screen</span>
            <Monitor className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold text-slate-900">{screen_time} <span className="text-xs font-normal text-slate-500">hrs/day</span></span>
        </div>

        {/* Workload */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-semibold">Avg Workload</span>
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold text-slate-900">{workload} <span className="text-xs font-normal text-slate-500">/ 5</span></span>
        </div>

      </div>
    </div>
  );
};

export default PersonalBaselineCard;
