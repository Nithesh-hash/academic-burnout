import React, { useState } from 'react';
import { riskAPI } from '../api';
import { Zap, Sliders, AlertTriangle } from 'lucide-react';

const WhatIfSimulator = () => {
  const [params, setParams] = useState({
    study_hours: 4.0,
    assignment_delay: 0,
    screen_time: 4.0,
    workload: 3,
    sleep_duration: 7.5,
    attendance: 95.0
  });
  const [simulatedRisk, setSimulatedRisk] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await riskAPI.analyzeRisk(params);
      setSimulatedRisk(res.data);
    } catch (error) {
      console.error('Simulation failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-2xs border border-slate-200">
      <h3 className="text-xl font-extrabold text-slate-900 flex items-center mb-2 tracking-tight">
        <Zap className="w-5 h-5 mr-2 text-indigo-600" />
        "What-If" Simulator
      </h3>
      <p className="text-sm text-slate-500 mb-6 font-medium">Test how a new commitment or delay might impact your risk score before it happens.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Simulated Study Hours: <span className="text-indigo-600">{params.study_hours}</span></label>
          <input type="range" min="0" max="15" step="0.5" className="w-full accent-indigo-600" value={params.study_hours} onChange={e => setParams({...params, study_hours: parseFloat(e.target.value)})} />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Simulated Assignment Delay (Days): <span className="text-indigo-600">{params.assignment_delay}</span></label>
          <input type="range" min="0" max="14" step="1" className="w-full accent-indigo-600" value={params.assignment_delay} onChange={e => setParams({...params, assignment_delay: parseInt(e.target.value)})} />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Simulated Workload (1-5): <span className="text-indigo-600">{params.workload}</span></label>
          <input type="range" min="1" max="5" step="1" className="w-full accent-indigo-600" value={params.workload} onChange={e => setParams({...params, workload: parseInt(e.target.value)})} />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Simulated Sleep (Hours): <span className="text-indigo-600">{params.sleep_duration}</span></label>
          <input type="range" min="0" max="12" step="0.5" className="w-full accent-indigo-600" value={params.sleep_duration} onChange={e => setParams({...params, sleep_duration: parseFloat(e.target.value)})} />
        </div>
      </div>

      <button onClick={handleSimulate} disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center">
        {loading ? <Sliders className="w-5 h-5 animate-spin mr-2" /> : <Sliders className="w-5 h-5 mr-2" />}
        Run Simulation
      </button>

      {simulatedRisk && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="text-md font-bold text-slate-800 mb-3">Simulation Results</h4>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-600 font-semibold">Predicted Risk Score:</span>
            <span className={`text-2xl font-black ${simulatedRisk.risk_score > 60 ? 'text-rose-600' : simulatedRisk.risk_score > 30 ? 'text-amber-500' : 'text-emerald-600'}`}>
              {simulatedRisk.risk_score}%
            </span>
          </div>
          {simulatedRisk.reasons.length > 0 && (
            <div className="text-sm text-slate-600">
              <p className="flex items-center mb-2 font-bold text-slate-700"><AlertTriangle className="w-4 h-4 mr-1 text-amber-500" /> Key Impacts:</p>
              <ul className="list-disc pl-5 space-y-1 font-medium">
                {simulatedRisk.reasons.slice(0, 3).map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WhatIfSimulator;
