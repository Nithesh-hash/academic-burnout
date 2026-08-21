import React from 'react';
import { Sparkles, Info, ArrowUpRight, Check } from 'lucide-react';

const ExplanationCard = ({ reasons = [], score = 0 }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">AI Explanation & Key Factors</h3>
          <p className="text-xs text-slate-500">Automated baseline deviation analysis engine</p>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
        <p className="text-sm font-semibold text-slate-700 mb-1">
          Analysis Summary (Risk Index: {score}%):
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          The AI engine compared your latest academic and lifestyle record against your personal historic baseline.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Primary Driving Factors</h4>
        {reasons && reasons.length > 0 ? (
          reasons.map((reason, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
              {score > 40 ? (
                <ArrowUpRight className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
              <span className="text-sm font-medium text-slate-700 leading-normal">{reason}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Info className="w-4 h-4 text-blue-500" />
            <span>No critical risk factors detected. Behavior aligns with standard routine.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplanationCard;
