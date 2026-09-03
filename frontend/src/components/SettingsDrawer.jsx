import React, { useState } from 'react';
import { X, Download, RotateCcw, AlertTriangle, FileSpreadsheet, FileCode, CheckCircle2, Shield, Settings, Database } from 'lucide-react';
import { riskAPI } from '../api';

const SettingsDrawer = ({ isOpen, onClose, historyData = [], riskHistoryData = [], baseline = {}, onBaselineResetSuccess }) => {
  const [resetting, setResetting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  // CSV Export Generator
  const handleExportCSV = () => {
    try {
      const records = riskHistoryData.length > 0 ? riskHistoryData : historyData;
      if (!records || records.length === 0) {
        alert('No assessment records available to export.');
        return;
      }

      const headers = [
        'Record_ID',
        'Date',
        'Timestamp',
        'Risk_Score',
        'Risk_Level',
        'Sleep_Hours',
        'Study_Hours',
        'Screen_Time',
        'Attendance_Pct',
        'Assignment_Delay_Days',
        'Workload_Level'
      ];

      const rows = records.map(r => {
        const metrics = r.current_metrics || r;
        return [
          r.id || r._id || 'N/A',
          r.date || 'N/A',
          r.timestamp || 'N/A',
          r.risk_score ?? 'N/A',
          r.risk_level ?? 'N/A',
          metrics.sleep_hours ?? metrics.sleep_duration ?? 'N/A',
          metrics.study_hours ?? 'N/A',
          metrics.screen_time ?? 'N/A',
          metrics.attendance ?? 'N/A',
          metrics.assignment_delay ?? 0,
          metrics.workload ?? 3
        ].map(val => `"${val}"`).join(',');
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `EduRisk_AI_Assessment_AuditLog_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage({ type: 'success', text: 'CSV Audit Log exported successfully.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to export CSV file.' });
    }
  };

  // JSON Export Generator
  const handleExportJSON = () => {
    try {
      const exportObject = {
        export_date: new Date().toISOString(),
        system: 'EduRisk AI Privacy-Friendly Behaviour Risk Monitoring',
        calibrated_baseline: baseline,
        total_risk_records: riskHistoryData.length,
        total_behaviour_records: historyData.length,
        risk_predictions_audit: riskHistoryData,
        behaviour_records: historyData
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', dataStr);
      link.setAttribute('download', `EduRisk_AI_Audit_Export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage({ type: 'success', text: 'JSON Audit Log exported successfully.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to export JSON file.' });
    }
  };

  // Baseline Reset Execution
  const handleConfirmReset = async () => {
    setResetting(true);
    setMessage(null);
    try {
      await riskAPI.resetBaseline();
      setShowConfirmReset(false);
      setMessage({ type: 'success', text: 'Historic baseline reset successfully. New semester calibration initiated.' });
      if (onBaselineResetSuccess) {
        onBaselineResetSuccess();
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to reset baseline.' });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Baseline & Audit Settings</h3>
              <p className="text-xs text-slate-400">Model calibration & data export management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm custom-scrollbar">
          
          {message && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message.text}</span>
            </div>
          )}

          {/* Section 1: Data & Audit Log Export */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm border-b border-slate-100 pb-2">
              <Download className="w-4 h-4 text-blue-600" />
              Export AI Risk Assessment Audit Log
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Download your full historic academic behaviour records, Isolation Forest anomaly assessments, and baseline comparison audit trails.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleExportCSV}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Export as CSV</span>
                    <span className="text-[10px] text-slate-400">Spreadsheet table format</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </button>

              <button
                type="button"
                onClick={handleExportJSON}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Export as JSON</span>
                    <span className="text-[10px] text-slate-400">Full structured payload</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
              </button>
            </div>
          </div>

          {/* Section 2: Dynamic Baseline Reset Controls */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm border-b border-slate-100 pb-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              Semester Baseline Calibration Control
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              When entering a new semester or quarter, your academic workload and schedule shift. Resetting your baseline starts a fresh calibration period without skewing predictions with old term averages.
            </p>

            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>Start New Semester Baseline (Reset Calibration)</span>
              </button>
            ) : (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 space-y-3">
                <div className="flex items-start gap-2.5 text-rose-800 text-xs">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                  <div>
                    <span className="font-bold block">Are you sure you want to reset your baseline?</span>
                    <span>This will clear past behaviour logs to re-calibrate your AI baseline model for a new term.</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={resetting}
                    onClick={handleConfirmReset}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    {resetting ? 'Resetting Baseline...' : 'Yes, Reset Baseline'}
                  </button>
                  <button
                    type="button"
                    disabled={resetting}
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Privacy & Engine Status */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Privacy & Storage Status</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Records are stored locally with zero third-party biometric trackers or optical surveillance. Baselines are computed per student using localized relative-deviation thresholds.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsDrawer;
