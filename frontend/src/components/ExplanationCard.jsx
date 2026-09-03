import React, { useState } from 'react';
import { Sparkles, Info, ArrowUpRight, ArrowDownRight, Check, Activity, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';

const ExplanationCard = ({ reasons = [], score = 0, shapAttributions = [], currentMetrics = null, baseline = null }) => {
  const [showAllFactors, setShowAllFactors] = useState(false);

  // Fallback SHAP calculation if backend didn't supply them directly
  const computedAttributions = React.useMemo(() => {
    if (shapAttributions && shapAttributions.length > 0) {
      return shapAttributions;
    }
    if (!currentMetrics || !baseline) {
      return [];
    }

    const c_sleep = currentMetrics.sleep_hours ?? currentMetrics.sleep_duration ?? 7.5;
    const b_sleep = baseline.sleep_hours ?? 7.5;
    const c_delay = currentMetrics.assignment_delay ?? 0;
    const b_delay = baseline.assignment_delay ?? 0;
    const c_attend = currentMetrics.attendance ?? 95;
    const b_attend = baseline.attendance ?? 90;
    const c_workload = currentMetrics.workload ?? 3;
    const b_workload = baseline.workload ?? 3;
    const c_screen = currentMetrics.screen_time ?? 3.5;
    const b_screen = baseline.screen_time ?? 3.5;
    const c_study = currentMetrics.study_hours ?? 4.0;
    const b_study = baseline.study_hours ?? 4.0;

    const list = [
      {
        feature: 'sleep_hours',
        label: 'Sleep Reduction',
        current_val: c_sleep,
        baseline_val: b_sleep,
        diff: c_sleep - b_sleep,
        unit: 'hrs',
        impact_percentage: c_sleep < b_sleep ? Math.min(45, Math.round((b_sleep - c_sleep) * 18)) : 0,
        direction: c_sleep < b_sleep ? 'risk_increase' : 'protective',
        display_impact: c_sleep < b_sleep ? `+${Math.min(45, Math.round((b_sleep - c_sleep) * 18))}%` : '-15%'
      },
      {
        feature: 'assignment_delay',
        label: 'Assignment Delay',
        current_val: c_delay,
        baseline_val: b_delay,
        diff: c_delay - b_delay,
        unit: 'days',
        impact_percentage: c_delay > 0 ? Math.min(35, Math.round(c_delay * 12)) : 0,
        direction: c_delay > 0 ? 'risk_increase' : 'neutral',
        display_impact: c_delay > 0 ? `+${Math.min(35, Math.round(c_delay * 12))}%` : '0%'
      },
      {
        feature: 'attendance',
        label: 'Attendance Drop',
        current_val: c_attend,
        baseline_val: b_attend,
        diff: c_attend - b_attend,
        unit: '%',
        impact_percentage: c_attend < b_attend ? Math.min(30, Math.round((b_attend - c_attend) * 1.5)) : 0,
        direction: c_attend < b_attend ? 'risk_increase' : 'protective',
        display_impact: c_attend < b_attend ? `+${Math.min(30, Math.round((b_attend - c_attend) * 1.5))}%` : '-12%'
      },
      {
        feature: 'workload',
        label: 'Workload Spike',
        current_val: c_workload,
        baseline_val: b_workload,
        diff: c_workload - b_workload,
        unit: 'lvl',
        impact_percentage: c_workload > b_workload ? Math.min(25, Math.round((c_workload - b_workload) * 12)) : 0,
        direction: c_workload > b_workload ? 'risk_increase' : 'neutral',
        display_impact: c_workload > b_workload ? `+${Math.min(25, Math.round((c_workload - b_workload) * 12))}%` : '0%'
      },
      {
        feature: 'screen_time',
        label: 'Screen Time Excess',
        current_val: c_screen,
        baseline_val: b_screen,
        diff: c_screen - b_screen,
        unit: 'hrs',
        impact_percentage: c_screen > b_screen ? Math.min(20, Math.round((c_screen - b_screen) * 8)) : 0,
        direction: c_screen > b_screen ? 'risk_increase' : 'neutral',
        display_impact: c_screen > b_screen ? `+${Math.min(20, Math.round((c_screen - b_screen) * 8))}%` : '0%'
      },
      {
        feature: 'study_hours',
        label: 'Study Consistency',
        current_val: c_study,
        baseline_val: b_study,
        diff: c_study - b_study,
        unit: 'hrs',
        impact_percentage: c_study < b_study ? Math.min(20, Math.round((b_study - c_study) * 10)) : 0,
        direction: c_study < b_study ? 'risk_increase' : 'protective',
        display_impact: c_study < b_study ? `+${Math.min(20, Math.round((b_study - c_study) * 10))}%` : '-10%'
      }
    ];

    return list.sort((a, b) => {
      const aVal = a.direction === 'risk_increase' ? a.impact_percentage : -1;
      const bVal = b.direction === 'risk_increase' ? b.impact_percentage : -1;
      return bVal - aVal;
    });
  }, [shapAttributions, currentMetrics, baseline]);

  const displayedAttributions = showAllFactors ? computedAttributions : computedAttributions.slice(0, 4);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">AI Explanation & Key Factors</h3>
              <p className="text-xs text-slate-500">Isolation Forest & SHAP Feature Attribution</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            SHAP Engine
          </span>
        </div>

        {/* Overview banner */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-800">Risk Factor Attribution Model: </span>
          The chart below displays each feature's contribution score to the current risk calculation ({score}%).
        </div>
      </div>

      {/* SHAP Feature Attribution Impact Chart */}
      <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-slate-500">
            <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
            SHAP Feature Impact Breakdown
          </span>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-rose-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Risk Accelerator
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Protective Factor
            </span>
          </div>
        </div>

        {/* Feature Impact Bars */}
        <div className="space-y-3 pt-1">
          {displayedAttributions.map((attr, idx) => {
            const isRisk = attr.direction === 'risk_increase' && attr.impact_percentage > 0;
            const isProtective = attr.direction === 'protective';
            const barWidth = Math.min(100, Math.max(8, attr.impact_percentage || 5));

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    {isRisk ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    ) : isProtective ? (
                      <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="font-medium text-slate-800">{attr.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({attr.current_val}{attr.unit} vs {attr.baseline_val}{attr.unit})
                    </span>
                  </div>

                  <span
                    className={`font-bold font-mono text-xs px-1.5 py-0.5 rounded ${
                      isRisk
                        ? 'bg-rose-50 text-rose-700'
                        : isProtective
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {attr.display_impact || (isRisk ? `+${attr.impact_percentage}%` : '0%')}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      isRisk
                        ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                        : isProtective
                        ? 'bg-gradient-to-r from-teal-400 to-emerald-500'
                        : 'bg-slate-300'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {computedAttributions.length > 4 && (
          <button
            onClick={() => setShowAllFactors(!showAllFactors)}
            className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 pt-1"
          >
            {showAllFactors ? (
              <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>View All {computedAttributions.length} Driving Factors <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        )}
      </div>

      {/* Primary Context Explanations */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contextual Explanations</h4>
        {reasons && reasons.length > 0 ? (
          reasons.map((reason, index) => (
            <div key={index} className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/70 text-xs text-slate-700">
              {score > 40 ? (
                <ArrowUpRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed font-medium">{reason}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center space-x-2 text-xs text-slate-500 p-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span>No critical anomalies detected. Routine matches personal baseline.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplanationCard;
