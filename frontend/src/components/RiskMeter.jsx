import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

const RiskMeter = ({ score = 0, level = 'Low' }) => {
  // Determine color theme based on score & level
  const getTheme = () => {
    if (score <= 40) {
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        badgeBg: 'bg-emerald-500',
        meterBg: 'from-emerald-400 to-teal-500',
        icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
        statusLabel: 'Low Academic Risk',
        description: 'Your academic and lifestyle parameters match your baseline well.'
      };
    } else if (score <= 70) {
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        badgeBg: 'bg-amber-500',
        meterBg: 'from-amber-400 to-orange-500',
        icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
        statusLabel: 'Moderate Academic Risk',
        description: 'Unusual deviations detected in your routine (e.g. sleep/workload changes).'
      };
    } else {
      return {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        badgeBg: 'bg-rose-500',
        meterBg: 'from-rose-500 to-red-600',
        icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
        statusLabel: 'High Academic Risk',
        description: 'Significant cumulative stress or attendance/assignment delay pattern detected.'
      };
    }
  };

  const theme = getTheme();

  return (
    <div className={`p-6 rounded-2xl border ${theme.border} ${theme.bg} transition-all relative overflow-hidden`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Risk Score Dial */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-white shadow-inner flex flex-col items-center justify-center border-4 border-white relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-1000 ease-out`}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                style={{
                  color: score <= 40 ? '#10b981' : score <= 70 ? '#f59e0b' : '#ef4444'
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">{score}%</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Risk Score</span>
            </div>
          </div>
        </div>

        {/* Status Details */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
            {theme.icon}
            <h3 className={`text-xl font-bold ${theme.text}`}>{theme.statusLabel}</h3>
            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white ${theme.badgeBg}`}>
              {level} Risk
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-4">{theme.description}</p>
          
          {/* Risk scale legend */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>0-40 Low</span>
              <span>41-70 Moderate</span>
              <span>71-100 High</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div className="w-[40%] bg-emerald-400"></div>
              <div className="w-[30%] bg-amber-400"></div>
              <div className="w-[30%] bg-rose-500"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RiskMeter;
