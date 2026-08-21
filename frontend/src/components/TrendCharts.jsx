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
  Legend
} from 'recharts';
import { Clock, Moon, Monitor, GraduationCap, TrendingUp } from 'lucide-react';

const TrendCharts = ({ historyData = [] }) => {
  const [activeTab, setActiveTab] = useState('all');

  // Format date labels for chart
  const formattedData = historyData.map((item) => ({
    date: item.date ? item.date.slice(5) : 'Day',
    study: item.study_hours ?? 0,
    sleep: item.sleep_duration ?? item.sleep_hours ?? 0,
    screen: item.screen_time ?? 0,
    attendance: item.attendance ?? 0,
    workload: item.workload ?? 3,
    delay: item.assignment_delay ?? 0
  }));

  if (!formattedData.length) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
        <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="font-semibold">No Trend History Available</p>
        <p className="text-xs text-slate-400 mt-1">Log daily behaviour records to populate metric trend charts.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Academic & Lifestyle Behaviour Trends
          </h3>
          <p className="text-xs text-slate-500">Historical pattern tracking over recent entries</p>
        </div>

        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'all' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('study')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'study' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Study Hours
          </button>
          <button
            onClick={() => setActiveTab('sleep')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'sleep' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Sleep Duration
          </button>
          <button
            onClick={() => setActiveTab('screen')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'screen' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Screen Time
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'attendance' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Attendance %
          </button>
        </div>
      </div>

      {/* Grid of Charts or Specific Expanded Chart */}
      {activeTab === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Study Hours Trend */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-800">Study Hours Trend</h4>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                  <defs>
                    <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 11}} stroke="#94a3b8" />
                  <YAxis tick={{fontSize: 11}} stroke="#94a3b8" domain={[0, 'auto']} />
                  <Tooltip />
                  <Area type="monotone" dataKey="study" name="Study Hours" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#studyGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sleep Duration Trend */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center space-x-2 mb-3">
              <Moon className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-800">Sleep Duration Trend</h4>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                  <defs>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 11}} stroke="#94a3b8" />
                  <YAxis tick={{fontSize: 11}} stroke="#94a3b8" domain={[0, 12]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sleep" name="Sleep (Hours)" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#sleepGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Screen Time Trend */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center space-x-2 mb-3">
              <Monitor className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-bold text-slate-800">Screen Time Trend</h4>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 11}} stroke="#94a3b8" />
                  <YAxis tick={{fontSize: 11}} stroke="#94a3b8" domain={[0, 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="screen" name="Screen Time (Hrs)" stroke="#a855f7" strokeWidth={2.5} dot={{r: 3}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Trend */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center space-x-2 mb-3">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-800">Attendance Percentage Trend</h4>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                  <defs>
                    <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 11}} stroke="#94a3b8" />
                  <YAxis tick={{fontSize: 11}} stroke="#94a3b8" domain={[40, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#attendGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      ) : (
        /* Detailed Single Focus Chart */
        <div className="h-72 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              {activeTab === 'study' && <Area type="monotone" dataKey="study" name="Study Hours" stroke="#3b82f6" fill="#93c5fd" strokeWidth={3} />}
              {activeTab === 'sleep' && <Area type="monotone" dataKey="sleep" name="Sleep Duration (h)" stroke="#6366f1" fill="#c7d2fe" strokeWidth={3} />}
              {activeTab === 'screen' && <Area type="monotone" dataKey="screen" name="Screen Time (h)" stroke="#a855f7" fill="#e9d5ff" strokeWidth={3} />}
              {activeTab === 'attendance' && <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#10b981" fill="#a7f3d0" strokeWidth={3} />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
};

export default TrendCharts;
