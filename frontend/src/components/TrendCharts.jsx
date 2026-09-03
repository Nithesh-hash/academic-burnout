import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Dot
} from 'recharts';
import { Clock, Moon, Monitor, GraduationCap, TrendingUp, AlertTriangle, CheckCircle, Flame, Layers } from 'lucide-react';

// Custom Interactive Tooltip with Baseline Deltas and Risk Flags
const CustomChartTooltip = ({ active, payload, label, baseline = {}, metricKey = 'all' }) => {
  if (!active || !payload || !payload.length) return null;

  const dataPoint = payload[0]?.payload || {};
  const isHighRisk = dataPoint.isHighRisk;
  const isModRisk = dataPoint.isModRisk;

  const getDeltaBadge = (key, val, baseVal, unit) => {
    if (baseVal === undefined || baseVal === null) return null;
    const diff = Math.round((val - baseVal) * 10) / 10;
    const sign = diff > 0 ? '+' : '';
    const isSleep = key === 'sleep';
    const isStudy = key === 'study';
    const isAttendance = key === 'attendance';
    const isAdverse = (isSleep && diff < 0) || (isStudy && diff < 0) || (isAttendance && diff < 0) || (!isSleep && !isStudy && !isAttendance && diff > 0);

    return (
      <span
        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
          Math.abs(diff) === 0
            ? 'bg-slate-100 text-slate-600'
            : isAdverse
            ? 'bg-rose-50 text-rose-700'
            : 'bg-emerald-50 text-emerald-700'
        }`}
      >
        {sign}{diff}{unit} vs baseline
      </span>
    );
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-2 min-w-[200px]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <span className="font-bold text-slate-200">Date: {dataPoint.fullDate || label}</span>
        {isHighRisk ? (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400" /> High Risk
          </span>
        ) : isModRisk ? (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> Mod Risk
          </span>
        ) : (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> Normal Routine
          </span>
        )}
      </div>

      <div className="space-y-1.5 pt-0.5">
        {payload.map((entry, index) => {
          let baselineVal = null;
          let unit = '';
          if (entry.dataKey === 'study') {
            baselineVal = baseline.study_hours ?? 4.0;
            unit = 'h';
          } else if (entry.dataKey === 'sleep') {
            baselineVal = baseline.sleep_hours ?? 7.5;
            unit = 'h';
          } else if (entry.dataKey === 'screen') {
            baselineVal = baseline.screen_time ?? 3.5;
            unit = 'h';
          } else if (entry.dataKey === 'attendance') {
            baselineVal = baseline.attendance ?? 90;
            unit = '%';
          }

          return (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span className="text-slate-300 capitalize">{entry.name}:</span>
                <span className="font-bold font-mono text-white">
                  {entry.value}{unit}
                </span>
              </div>
              {baselineVal !== null && getDeltaBadge(entry.dataKey, entry.value, baselineVal, unit)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Custom Visual Marker for High / Moderate Risk days
const RenderRiskDot = (props) => {
  const { cx, cy, payload } = props;
  if (payload.isHighRisk) {
    return (
      <circle cx={cx} cy={cy} r={5} fill="#f43f5e" stroke="#ffffff" strokeWidth={2} className="animate-pulse" />
    );
  }
  if (payload.isModRisk) {
    return (
      <circle cx={cx} cy={cy} r={4} fill="#f59e0b" stroke="#ffffff" strokeWidth={1.5} />
    );
  }
  return <circle cx={cx} cy={cy} r={2.5} fill="#3b82f6" />;
};

const TrendCharts = ({ historyData = [], baseline = {} }) => {
  const [activeTab, setActiveTab] = useState('all');

  // Format date labels & calculate stress flags for charts
  const formattedData = historyData.map((item, idx) => {
    const sleep = item.sleep_duration ?? item.sleep_hours ?? 7.5;
    const study = item.study_hours ?? 4.0;
    const screen = item.screen_time ?? 3.5;
    const delay = item.assignment_delay ?? 0;
    const attendance = item.attendance ?? 90;

    // Detect risk condition for marker
    const isHighRisk = sleep < 5.0 || delay >= 3 || attendance < 75;
    const isModRisk = !isHighRisk && (sleep < 6.2 || delay >= 1 || screen > 6.0);

    return {
      date: item.date ? item.date.slice(5) : `D${idx + 1}`,
      fullDate: item.date || `Entry #${idx + 1}`,
      study: study,
      sleep: sleep,
      screen: screen,
      attendance: attendance,
      workload: item.workload ?? 3,
      delay: delay,
      isHighRisk,
      isModRisk
    };
  });

  if (!formattedData.length) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
        <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="font-semibold">No Trend History Available</p>
        <p className="text-xs text-slate-400 mt-1">Log daily behaviour records to populate metric trend charts.</p>
      </div>
    );
  }

  const baseSleep = baseline.sleep_hours ?? 7.5;
  const baseStudy = baseline.study_hours ?? 4.0;
  const baseScreen = baseline.screen_time ?? 3.5;
  const baseAttend = baseline.attendance ?? 90.0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      
      {/* Header & Metric Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Academic & Lifestyle Behaviour Trends
            </h3>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Interactive Tooltips Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Hover points to see exact dates, baseline deltas, and risk markers
          </p>
        </div>

        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'all', label: 'All-in-One' },
            { id: 'sleep', label: 'Sleep Duration' },
            { id: 'study', label: 'Study Hours' },
            { id: 'screen', label: 'Screen Time' },
            { id: 'attendance', label: 'Attendance %' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Charts or Specific Expanded Chart */}
      {activeTab === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sleep Hours Trend */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-extrabold uppercase text-slate-800">Sleep Duration vs Baseline ({baseSleep}h)</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Target: ≥ 7.0h</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 12]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <ReferenceLine y={baseSleep} stroke="#6366f1" strokeDasharray="4 4" strokeWidth={1.5} />
                  <Tooltip content={<CustomChartTooltip baseline={baseline} metricKey="sleep" />} />
                  <Area type="monotone" dataKey="sleep" name="Sleep" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#sleepGrad)" dot={<RenderRiskDot />} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Study Hours Trend */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-extrabold uppercase text-slate-800">Study Hours vs Baseline ({baseStudy}h)</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Baseline: {baseStudy}h</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <ReferenceLine y={baseStudy} stroke="#2563eb" strokeDasharray="4 4" strokeWidth={1.5} />
                  <Tooltip content={<CustomChartTooltip baseline={baseline} metricKey="study" />} />
                  <Area type="monotone" dataKey="study" name="Study" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#studyGrad)" dot={<RenderRiskDot />} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Screen Time Trend */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-extrabold uppercase text-slate-800">Screen Time vs Baseline ({baseScreen}h)</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Fatigue: &gt; 6.0h</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 12]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <ReferenceLine y={baseScreen} stroke="#9333ea" strokeDasharray="4 4" strokeWidth={1.5} />
                  <Tooltip content={<CustomChartTooltip baseline={baseline} metricKey="screen" />} />
                  <Area type="monotone" dataKey="screen" name="Screen Time" stroke="#9333ea" strokeWidth={2.5} fillOpacity={1} fill="url(#screenGrad)" dot={<RenderRiskDot />} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Trend */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-extrabold uppercase text-slate-800">Attendance % vs Baseline ({baseAttend}%)</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Threshold: 75%</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <ReferenceLine y={75} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '75% Minimum', fill: '#f43f5e', fontSize: 9 }} />
                  <ReferenceLine y={baseAttend} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} />
                  <Tooltip content={<CustomChartTooltip baseline={baseline} metricKey="attendance" />} />
                  <Area type="monotone" dataKey="attendance" name="Attendance" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#attendGrad)" dot={<RenderRiskDot />} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      ) : (
        /* Full Expanded Chart for Selected Tab */
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 capitalize">
              Expanded {activeTab} Performance Trend & Risk Markers
            </h4>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Recorded Value
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Risk Anomaly Marker
              </span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  domain={activeTab === 'attendance' ? [50, 100] : [0, 14]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip content={<CustomChartTooltip baseline={baseline} metricKey={activeTab} />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={activeTab}
                  name={activeTab.toUpperCase()}
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={<RenderRiskDot />}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Bottom Chart Legend & Visual Risk Indicator Guide */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <span className="w-3 h-0.5 bg-blue-600 inline-block"></span> Solid Line: Daily Logs
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <span className="w-3 h-0.5 border-b-2 border-dashed border-indigo-500 inline-block"></span> Dashed Line: Calibrated Baseline
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-rose-600 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Red Dot: High Burnout Risk
          </span>
          <span className="flex items-center gap-1 text-amber-600 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Amber Dot: Moderate Risk
          </span>
        </div>
      </div>

    </div>
  );
};

export default TrendCharts;
