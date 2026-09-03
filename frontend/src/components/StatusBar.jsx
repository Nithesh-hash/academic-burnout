import React from 'react';
import { ShieldCheck, Calendar, Activity, CheckCircle2, Clock, Cpu, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StatusBar = ({ totalDays = 0, sampleSize = 0, baseline = null }) => {
  const { user } = useAuth();

  const daysCount = totalDays || sampleSize || baseline?.record_count || 0;
  const isCalibrated = daysCount >= 7;
  const calibrationProgress = Math.min(100, Math.round((daysCount / 7) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: User & Academic Context */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 shadow-2xs">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">{user?.name || 'Student Account'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                {user?.year || '1st Year'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.department || 'Software Engineering'} • <span className="text-slate-400 font-mono text-[11px]">ID: {user?.id?.slice(0, 8) || 'Active'}</span>
            </p>
          </div>
        </div>

        {/* Right: Consolidated Operational Status Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          
          {/* Badge 1: Total Days Logged */}
          <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-1.5 rounded-lg bg-blue-100/70 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Total Days Logged</span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {daysCount} {daysCount === 1 ? 'Day' : 'Days'} Record
              </span>
            </div>
          </div>

          {/* Badge 2: Baseline Calibration State */}
          <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className={`p-1.5 rounded-lg ${isCalibrated ? 'bg-emerald-100/80 text-emerald-600' : 'bg-amber-100/80 text-amber-600'}`}>
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Baseline Calibration</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${isCalibrated ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isCalibrated ? 'Calibrated' : `Calibrating (${daysCount}/7d)`}
                </span>
                {isCalibrated && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </div>
          </div>

          {/* Badge 3: Model Privacy Mode */}
          <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Privacy Mode</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800">Zero-PII Client Anonymized</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StatusBar;
