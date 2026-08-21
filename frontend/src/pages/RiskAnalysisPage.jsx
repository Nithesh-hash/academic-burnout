import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LogBehaviourModal from '../components/LogBehaviourModal';
import { riskAPI, behaviourAPI } from '../api';
import { ShieldCheck, ShieldAlert, Cpu, EyeOff, Lock, CheckCircle, HelpCircle, Activity } from 'lucide-react';

const RiskAnalysisPage = () => {
  const [riskHistory, setRiskHistory] = useState([]);
  const [baseline, setBaseline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [historyRes, baselineRes] = await Promise.all([
        riskAPI.getRiskHistory(30),
        riskAPI.getPersonalBaseline()
      ]);
      setRiskHistory(historyRes.data || []);
      setBaseline(baselineRes.data?.baseline || null);
    } catch (err) {
      console.error("Failed to load risk analysis page:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onOpenLogModal={() => setIsLogModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>AI Risk Engine Insights</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Risk & Personal Baseline Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Understanding how Isolation Forest and relative deviation metrics compute risk scores without invading privacy.
          </p>
        </div>

        {/* Privacy Guarantees Box */}
        <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-800 border border-emerald-700">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
              </div>
              <h3 className="font-bold text-lg text-emerald-50">Strict Privacy Principles Guaranteed</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-emerald-100 pt-2">
              <div className="flex items-start space-x-2.5 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/60">
                <EyeOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-emerald-200">No Webcams or Cameras</span>
                  <span>We never access optical camera streams or record video feeds.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/60">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-emerald-200">No Facial Recognition</span>
                  <span>Zero biometric scanning, emotion detection, or facial landmark tracking.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/60">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-emerald-200">No Medical Diagnosis</span>
                  <span>Focuses purely on self-reported academic progress & lifestyle routine metrics.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Risk Predictions Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            AI Risk Assessment Audit Log
          </h3>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase">
                  <th className="p-3">Date</th>
                  <th className="p-3">Risk Score</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Primary AI Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {riskHistory.length > 0 ? (
                  riskHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">{item.date || 'Today'}</td>
                      <td className="p-3">
                        <span className={`font-bold text-sm ${item.risk_score <= 40 ? 'text-emerald-600' : item.risk_score <= 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                          {item.risk_score}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.risk_level === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                          item.risk_level === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {item.risk_level}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">
                        {item.reasons && item.reasons.length > 0 ? item.reasons[0] : 'Normal routine'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-slate-400">
                      No historical risk analysis entries logged yet.
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
    </div>
  );
};

export default RiskAnalysisPage;
