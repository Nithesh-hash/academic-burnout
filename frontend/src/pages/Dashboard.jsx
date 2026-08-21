import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { behaviourAPI, riskAPI } from '../api';
import Navbar from '../components/Navbar';
import RiskMeter from '../components/RiskMeter';
import ExplanationCard from '../components/ExplanationCard';
import TrendCharts from '../components/TrendCharts';
import PersonalBaselineCard from '../components/PersonalBaselineCard';
import LogBehaviourModal from '../components/LogBehaviourModal';
import { Sparkles, PlusCircle, RefreshCw, Calendar, CheckCircle2, Clock, Moon, Monitor, GraduationCap, Layers } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [history, setHistory] = useState([]);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Parallel API queries
      const [historyRes, riskRes, baselineRes] = await Promise.all([
        behaviourAPI.getHistory(30),
        riskAPI.analyzeRisk(),
        riskAPI.getPersonalBaseline()
      ]);

      setHistory(historyRes.data || []);
      setLatestAnalysis(riskRes.data || null);
      setBaseline(baselineRes.data?.baseline || null);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeedSampleData = async () => {
    setSeeding(true);
    try {
      await behaviourAPI.seedSampleData();
      await fetchData();
    } catch (err) {
      console.error("Failed to seed sample data:", err);
    } finally {
      setSeeding(false);
    }
  };

  // Get latest record for metric summary cards
  const latestRecord = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onOpenLogModal={() => setIsLogModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Student'} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {user?.department} • {user?.year} • Academic Risk Monitoring Overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedSampleData}
              disabled={seeding}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>{seeding ? 'Seeding...' : 'Load 14-Day Sample Demo'}</span>
            </button>

            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Today's Entry</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            <span className="ml-3 font-medium">Running AI Risk & Baseline Analysis...</span>
          </div>
        ) : (
          <>
            {/* Row 1: AI Risk Gauge & AI Reasons Explanation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <RiskMeter
                  score={latestAnalysis?.risk_score ?? 0}
                  level={latestAnalysis?.risk_level ?? 'Low'}
                />
              </div>

              <div className="lg:col-span-6">
                <ExplanationCard
                  reasons={latestAnalysis?.reasons ?? []}
                  score={latestAnalysis?.risk_score ?? 0}
                />
              </div>
            </div>

            {/* Row 2: Behaviour Summary Cards */}
            {latestRecord && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-blue-600 mb-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Daily Study</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{latestRecord.study_hours} <span className="text-xs font-normal text-slate-500">h</span></div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-indigo-600 mb-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Sleep Duration</span>
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{latestRecord.sleep_duration ?? latestRecord.sleep_hours} <span className="text-xs font-normal text-slate-500">h</span></div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-purple-600 mb-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Screen Time</span>
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{latestRecord.screen_time} <span className="text-xs font-normal text-slate-500">h</span></div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-emerald-600 mb-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Attendance</span>
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{latestRecord.attendance}%</div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-amber-600 mb-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Workload</span>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">Lvl {latestRecord.workload}</div>
                </div>
              </div>
            )}

            {/* Row 3: Personal Baseline Card */}
            <PersonalBaselineCard
              baseline={baseline || {}}
              studentName={user?.name}
            />

            {/* Row 4: Recharts Trend Graphs */}
            <TrendCharts historyData={history} />
          </>
        )}

      </main>

      {/* Log Behaviour Modal */}
      <LogBehaviourModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Dashboard;
