import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, Circle, Sparkles, TrendingDown, ArrowRight, Award, Flame, CalendarCheck } from 'lucide-react';

const ActionPlanCard = ({ recommendations = [], riskLevel = 'Low', riskScore = 0 }) => {
  // Checkable state with local storage persistence
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('edurisk_action_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleTask = (taskId) => {
    const updated = {
      ...completedTasks,
      [taskId]: !completedTasks[taskId]
    };
    setCompletedTasks(updated);
    try {
      localStorage.setItem('edurisk_action_tasks', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Build default fallback recommendations if backend did not provide
  const items = React.useMemo(() => {
    if (recommendations && recommendations.length > 0) {
      return recommendations;
    }

    if (riskLevel === 'High') {
      return [
        {
          id: 'act_sleep_recovery',
          title: 'Immediate Sleep Buffer',
          description: 'Target 7.0+ hours of sleep over the next 2 consecutive days to reduce cognitive burnout penalty.',
          impact: 'High Impact (-25% Risk)',
          category: 'Rest & Recovery'
        },
        {
          id: 'act_clear_pending',
          title: 'Resolve Overdue Submissions',
          description: 'Prioritize completing 1 overdue assignment module today to eliminate continuous delay flags.',
          impact: 'Academic Stabilization (-20% Risk)',
          category: 'Coursework'
        },
        {
          id: 'act_screen_reduction',
          title: 'Evening Digital Fast',
          description: 'Limit non-study screen time after 9:30 PM with a 45-minute blue light rest period.',
          impact: 'Fatigue Relief (-15% Risk)',
          category: 'Lifestyle Routine'
        }
      ];
    } else if (riskLevel === 'Moderate') {
      return [
        {
          id: 'act_mod_sleep',
          title: 'Stabilize Sleep Schedule',
          description: 'Aim for consistent 7.2 hours of sleep tonight to return toward your calibrated baseline.',
          impact: 'Moderate Impact (-18% Risk)',
          category: 'Rest & Recovery'
        },
        {
          id: 'act_mod_study',
          title: 'Structured Study Sprint',
          description: 'Conduct a focused 2-hour study block using 25-minute Pomodoro sessions with 5-minute active breaks.',
          impact: 'Focus Enhancement',
          category: 'Academic Health'
        },
        {
          id: 'act_mod_screen',
          title: 'Screen Interval Breaks',
          description: 'Take a 10-minute eye relaxation pause for every 50 minutes of laptop or phone display usage.',
          impact: 'Stress Shielding',
          category: 'Lifestyle Routine'
        }
      ];
    } else {
      return [
        {
          id: 'act_low_routine',
          title: 'Maintain Baseline Balance',
          description: 'Your current academic workload and sleep duration are healthy and aligned with your calibrated baseline.',
          impact: 'Optimal Status (< 40%)',
          category: 'Routine Maintenance'
        },
        {
          id: 'act_low_schedule',
          title: 'Proactive Weekly Milestone Review',
          description: 'Review upcoming assignment submission deadlines today to prevent unexpected workload spikes.',
          impact: 'Preventive Strategy',
          category: 'Planning'
        }
      ];
    }
  }, [recommendations, riskLevel]);

  const completedCount = items.filter(item => completedTasks[item.id]).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const getHeaderTheme = () => {
    if (riskLevel === 'High') {
      return {
        bg: 'from-amber-500/10 via-rose-500/10 to-purple-500/10',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        accent: 'text-rose-600',
        progress: 'bg-gradient-to-r from-amber-500 to-rose-500'
      };
    } else if (riskLevel === 'Moderate') {
      return {
        bg: 'from-blue-500/10 via-indigo-500/10 to-amber-500/10',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        accent: 'text-amber-600',
        progress: 'bg-gradient-to-r from-blue-500 to-amber-500'
      };
    }
    return {
      bg: 'from-emerald-500/10 via-teal-500/10 to-blue-500/10',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      accent: 'text-emerald-600',
      progress: 'bg-gradient-to-r from-teal-500 to-emerald-500'
    };
  };

  const theme = getHeaderTheme();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Banner */}
      <div className={`p-5 sm:p-6 bg-gradient-to-r ${theme.bg} border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-white shadow-xs text-blue-600 border border-slate-200/60">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-lg">AI Actionable Recommendations</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${theme.badge}`}>
                {riskLevel} Risk Target
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Personalized recovery goals generated from baseline anomaly deviations.
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Goals Completed</span>
            <span className="text-sm font-extrabold text-slate-800">
              {completedCount} of {items.length} Tasks
            </span>
          </div>
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${theme.progress} transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="p-5 sm:p-6 space-y-3.5">
        {items.map((item) => {
          const isDone = !!completedTasks[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleTask(item.id)}
              className={`group p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                isDone
                  ? 'bg-slate-50/70 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-xs'
              }`}
            >
              {/* Checkbox */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTask(item.id);
                }}
                className="mt-0.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0"
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 group-hover:stroke-blue-600" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold transition-all ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </div>

                  {item.impact && (
                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {item.impact}
                    </span>
                  )}
                </div>

                <p className={`text-xs leading-relaxed ${isDone ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Completion Message */}
        {completedCount === items.length && items.length > 0 && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
            <span className="font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              All recovery goals checked! Your behaviour pattern is actively recovering toward baseline.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionPlanCard;
