import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatusBar from '../components/StatusBar';
import SettingsDrawer from '../components/SettingsDrawer';
import LogBehaviourModal from '../components/LogBehaviourModal';
import WhatIfSimulator from '../components/WhatIfSimulator';
import { riskAPI, behaviourAPI } from '../api';
import { ShieldCheck, Cpu, EyeOff, Lock, CheckCircle, Activity, Download, Settings, RefreshCw, ChevronRight, Trash2 } from 'lucide-react';

const RiskAnalysisPage = () => {
  const [riskHistory, setRiskHistory] = useState([]);
  const [behaviourHistory, setBehaviourHistory] = useState([]);
  const [baseline, setBaseline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [historyRes, behaviourRes, baselineRes] = await Promise.all([
        riskAPI.getRiskHistory(50),
        behaviourAPI.getHistory(50),
        riskAPI.getPersonalBaseline()
      ]);
      setRiskHistory(historyRes.data || []);
      setBehaviourHistory(behaviourRes.data || []);
      setBaseline(baselineRes.data?.baseline || null);
    } catch (err) {
      console.error("Failed to load risk analysis page:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (recordId, recordDate) => {
    if (!recordId) return;
    if (!window.confirm(`Are you sure you want to delete the audit record for ${recordDate || 'this date'}?`)) {
      return;
    }
    setDeletingId(recordId);
    try {
      await riskAPI.deleteRiskRecord(recordId);
      setRiskHistory(prev => prev.filter(r => (r.id || r._id) !== recordId));
      fetchData();
    } catch (err) {
      console.error("Failed to delete record:", err);
      alert("Failed to delete record. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        onOpenLogModal={() => setIsLogModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        
        {/* Consolidated Operational Status Bar */}
        <StatusBar
          totalDays={behaviourHistory.length}
          sampleSize={behaviourHistory.length}
          baseline={baseline}
        />

        {/* Page Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4" />
              <span>AI Isolation Forest & Audit Log</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Academic Risk & Baseline Assessment Audit Trail
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Full verifiable audit record of ML anomaly scores, SHAP attributions, and privacy-first baseline tracking.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV / JSON</span>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Settings className="w-4 h-4 text-blue-400" />
              <span>Semester Baseline Controls</span>
            </button>
          </div>
        </div>

        {/* What-If Simulator */}
        <WhatIfSimulator />

        {/* Privacy Guarantees Box */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden border border-emerald-800/40">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-800/80 border border-emerald-700 text-emerald-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-emerald-50">Strict Privacy Principles & Differential Shield</h3>
                <p className="text-xs text-emerald-200/80">Guaranteed client-side boundary and biometric isolation.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-emerald-100 pt-2">
              <div className="flex items-start space-x-2.5 bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-800/60">
                <EyeOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-emerald-200 text-xs">No Webcams or Cameras</span>
                  <span className="text-[11px] text-emerald-200/70">Never captures optical video feeds or background images.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-800/60">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-emerald-200 text-xs">No Facial Recognition</span>
                  <span className="text-[11px] text-emerald-200/70">Zero biometric scanning, emotion detection, or audio processing.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-800/60">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-emerald-200 text-xs">Relative Deviation Only</span>
                  <span className="text-[11px] text-emerald-200/70">Evaluates trends against your own self-reported baseline history.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Risk Predictions Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              AI Risk Assessment Audit Log
            </h3>
            <span className="text-xs font-mono font-semibold text-slate-400">
              Showing {riskHistory.length} Recorded Assessments
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="p-3.5">Record Date</th>
                  <th className="p-3.5">Risk Score</th>
                  <th className="p-3.5">Risk Tier</th>
                  <th className="p-3.5">Key Metrics (Sleep / Study / Delay)</th>
                  <th className="p-3.5">Primary AI Reason</th>
                  <th className="p-3.5 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {riskHistory.length > 0 ? (
                  riskHistory.map((item, idx) => {
                    const metrics = item.current_metrics || {};
                    const sleepVal = metrics.sleep_hours ?? metrics.sleep_duration ?? 'N/A';
                    const studyVal = metrics.study_hours ?? 'N/A';
                    const delayVal = metrics.assignment_delay ?? 0;
                    const recordId = item.id || item._id;

                    return (
                      <tr key={recordId || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 font-mono">{item.date || 'Today'}</td>
                        <td className="p-3.5">
                          <span
                            className={`font-black text-sm font-mono ${
                              item.risk_score <= 40
                                ? 'text-emerald-600'
                                : item.risk_score <= 70
                                ? 'text-amber-600'
                                : 'text-rose-600'
                            }`}
                          >
                            {item.risk_score}%
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              item.risk_level === 'Low'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.risk_level === 'Moderate'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.risk_level}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-600">
                          <span className="font-semibold text-indigo-600">{sleepVal}h sleep</span> •{' '}
                          <span className="font-semibold text-blue-600">{studyVal}h study</span> •{' '}
                          <span className={delayVal > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                            {delayVal}d delay
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 max-w-xs truncate">
                          {item.reasons && item.reasons.length > 0 ? item.reasons[0] : 'Healthy baseline aligned'}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleDeleteRecord(recordId, item.date)}
                            disabled={deletingId === recordId}
                            title="Delete Record"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center justify-center disabled:opacity-50 cursor-pointer"
                          >
                            {deletingId === recordId ? (
                              <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-400 font-medium">
                      No historical risk analysis entries logged yet. Log behaviour or load sample data from the dashboard.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <LogBehaviourModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={fetchData}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        historyData={behaviourHistory}
        riskHistoryData={riskHistory}
        baseline={baseline || {}}
        onBaselineResetSuccess={fetchData}
      />
    </div>
  );
};

export default RiskAnalysisPage;
