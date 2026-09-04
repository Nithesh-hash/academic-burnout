import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple
import os

try:
    from sklearn.ensemble import IsolationForest
    import joblib
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

class AIBehaviourRiskEngine:
    def __init__(self):
        self.model = None
        self._load_or_train_model()

    def _load_or_train_model(self):
        """Loads trained IsolationForest model or initializes a fallback classifier."""
        if not HAS_SKLEARN:
            print("Warning: scikit-learn not available. Using heuristic baseline risk analyzer.")
            return

        import sys
        if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
            model_path = os.path.join(sys._MEIPASS, "ml_model", "isolation_forest.joblib")
        else:
            model_path = os.path.join(
                os.path.dirname(os.path.abspath(__file__)),
                "../../..", "ml_model", "isolation_forest.joblib"
            )
        if os.path.exists(model_path):
            try:
                self.model = joblib.load(model_path)
                print("Loaded pre-trained Isolation Forest model successfully.")
                return
            except Exception as e:
                print(f"Could not load model file ({e}), training dynamic instance.")

        # Train inline model if not loaded from file
        X_train = self._generate_synthetic_baseline()
        self.model = IsolationForest(contamination=0.15, random_state=42, n_estimators=100)
        self.model.fit(X_train)

    def _generate_synthetic_baseline(self) -> np.ndarray:
        np.random.seed(42)
        n = 300
        sleep = np.random.normal(7.5, 0.8, n)
        study = np.random.normal(4.0, 1.0, n)
        screen = np.random.normal(3.5, 1.0, n)
        delay = np.random.poisson(0.3, n)
        attendance = np.random.normal(92.0, 4.0, n)
        workload = np.random.choice([2, 3, 4], n)
        return np.column_stack([sleep, study, screen, delay, attendance, workload])

    def calculate_baseline(self, historical_records: List[Dict[str, Any]]) -> Dict[str, float]:
        """Calculates personalized normal baseline averages for a student."""
        if not historical_records:
            return {
                "sleep_hours": 7.5,
                "study_hours": 4.0,
                "screen_time": 3.5,
                "assignment_delay": 0.0,
                "attendance": 90.0,
                "workload": 3.0,
                "record_count": 0
            }

        df = pd.DataFrame(historical_records)
        return {
            "sleep_hours": round(float(df["sleep_hours"].mean()), 1),
            "study_hours": round(float(df["study_hours"].mean()), 1),
            "screen_time": round(float(df["screen_time"].mean()), 1),
            "assignment_delay": round(float(df["assignment_delay"].mean()), 1),
            "attendance": round(float(df["attendance"].mean()), 1),
            "workload": round(float(df["workload"].mean()), 1),
            "record_count": len(historical_records)
        }

    def analyze_risk(
        self,
        current: Dict[str, Any],
        historical_records: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Calculates Behaviour Risk Score (0-100), Risk Level, and AI Explanations.
        Input vector: [sleep_hours, study_hours, screen_time, assignment_delay, attendance, workload]
        """
        baseline = self.calculate_baseline(historical_records or [])
        
        c_sleep = float(current.get("sleep_hours", 7.0))
        c_study = float(current.get("study_hours", 4.0))
        c_screen = float(current.get("screen_time", 4.0))
        c_delay = float(current.get("assignment_delay", 0))
        c_attendance = float(current.get("attendance", 90.0))
        c_workload = float(current.get("workload", 3))

        b_sleep = baseline["sleep_hours"]
        b_study = baseline["study_hours"]
        b_screen = baseline["screen_time"]
        b_delay = baseline["assignment_delay"]
        b_attendance = baseline["attendance"]
        b_workload = baseline["workload"]

        # 1. Isolation Forest Anomaly Score
        vector = np.array([[c_sleep, c_study, c_screen, c_delay, c_attendance, c_workload]])
        if self.model and HAS_SKLEARN:
            # decision_function returns negative values for anomalies, positive for normal
            decision_score = float(self.model.decision_function(vector)[0])
            # Map decision_score (approx -0.35 to +0.25) to anomaly factor (0.0 to 1.0)
            if decision_score < 0:
                if_anomaly_factor = min(1.0, abs(decision_score) / 0.35)
            else:
                if_anomaly_factor = max(0.0, 0.2 - (decision_score * 0.5))
        else:
            if_anomaly_factor = 0.3

        # 2. Personal Baseline Relative Deviation Penalty Calculation
        penalties = 0.0
        
        # Sleep reduction (high risk if sleep drops significantly below personal baseline or < 5h)
        sleep_diff = b_sleep - c_sleep
        if sleep_diff > 0.5:
            penalties += min(30, sleep_diff * 12)
        if c_sleep < 5.0:
            penalties += 15

        # Sudden workload increase
        workload_diff = c_workload - b_workload
        if workload_diff > 0.5:
            penalties += min(20, workload_diff * 10)

        # Screen time spike
        screen_diff = c_screen - b_screen
        if screen_diff > 1.0:
            penalties += min(20, screen_diff * 6)

        # Assignment delay increase
        delay_diff = c_delay - b_delay
        if delay_diff > 0:
            penalties += min(25, delay_diff * 10)
        if c_delay >= 3:
            penalties += 15

        # Attendance drop
        attendance_drop = b_attendance - c_attendance
        if attendance_drop > 2.0:
            penalties += min(25, (attendance_drop / 100.0) * 80)
        if c_attendance < 75.0:
            penalties += 20

        # Study hours severe crash
        study_drop = b_study - c_study
        if study_drop > 1.5:
            penalties += min(15, study_drop * 8)

        # Combine Isolation Forest + Baseline Penalties
        raw_score = (if_anomaly_factor * 35.0) + (penalties * 0.65)
        risk_score = int(round(min(100.0, max(0.0, raw_score))))

        # Determine Risk Level
        if risk_score <= 40:
            risk_level = "Low"
        elif risk_score <= 70:
            risk_level = "Moderate"
        else:
            risk_level = "High"

        # Generate AI Reasons
        reasons = []
        if sleep_diff >= 1.0:
            reasons.append(f"Sleep decreased by {round(sleep_diff, 1)} hrs compared to normal baseline ({c_sleep}h vs {b_sleep}h)")
        elif c_sleep < 5.5:
            reasons.append(f"Sleep duration is low ({c_sleep} hrs/day)")

        if delay_diff >= 1:
            reasons.append(f"Assignment delay increased by {int(round(delay_diff))} days")
        elif c_delay > 0:
            reasons.append(f"Pending assignment delay of {int(c_delay)} day(s)")

        if workload_diff >= 1.0:
            reasons.append(f"Workload level increased (Level {int(c_workload)} vs baseline {b_workload})")

        if screen_diff >= 1.5:
            reasons.append(f"Screen time increased by {round(screen_diff, 1)} hrs over baseline")

        if attendance_drop >= 5.0:
            reasons.append(f"Attendance dropped by {round(attendance_drop, 1)}% from baseline")
        elif c_attendance < 80.0:
            reasons.append(f"Attendance is low ({round(c_attendance, 1)}%)")

        if study_drop >= 1.5:
            reasons.append(f"Daily study hours dropped by {round(study_drop, 1)} hrs")

        if not reasons:
            reasons.append("Academic and lifestyle indicators are aligned with your healthy baseline.")

        # Calculate SHAP-style Feature Impact Attributions
        shap_attributions = self._calculate_shap_attributions(
            current_metrics={
                "sleep_hours": c_sleep,
                "study_hours": c_study,
                "screen_time": c_screen,
                "assignment_delay": c_delay,
                "attendance": c_attendance,
                "workload": c_workload
            },
            baseline_metrics=baseline,
            penalties={
                "sleep": sleep_diff * 12 if sleep_diff > 0.5 else (15 if c_sleep < 5.0 else 0),
                "workload": workload_diff * 10 if workload_diff > 0.5 else 0,
                "screen": screen_diff * 6 if screen_diff > 1.0 else 0,
                "delay": (delay_diff * 10 if delay_diff > 0 else 0) + (15 if c_delay >= 3 else 0),
                "attendance": ((attendance_drop / 100.0) * 80 if attendance_drop > 2.0 else 0) + (20 if c_attendance < 75.0 else 0),
                "study": study_drop * 8 if study_drop > 1.5 else 0
            },
            total_risk_score=risk_score
        )

        # Generate Actionable Recommendations
        action_recommendations = self._generate_actionable_recommendations(
            risk_level=risk_level,
            risk_score=risk_score,
            c_sleep=c_sleep,
            b_sleep=b_sleep,
            c_delay=c_delay,
            c_screen=c_screen,
            b_screen=b_screen,
            c_attendance=c_attendance,
            c_study=c_study,
            b_study=b_study,
            c_workload=c_workload
        )

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "reasons": reasons,
            "shap_attributions": shap_attributions,
            "action_recommendations": action_recommendations,
            "baseline": baseline,
            "current_metrics": {
                "sleep_hours": c_sleep,
                "study_hours": c_study,
                "screen_time": c_screen,
                "assignment_delay": c_delay,
                "attendance": c_attendance,
                "workload": c_workload
            }
        }

    def _calculate_shap_attributions(
        self,
        current_metrics: Dict[str, float],
        baseline_metrics: Dict[str, float],
        penalties: Dict[str, float],
        total_risk_score: int
    ) -> List[Dict[str, Any]]:
        """
        Computes SHAP-style relative contribution score and percentage impact
        for each driving behavioural dimension.
        """
        features_meta = [
            {
                "key": "sleep_hours",
                "label": "Sleep Duration",
                "penalty": penalties.get("sleep", 0),
                "current": current_metrics["sleep_hours"],
                "baseline": baseline_metrics.get("sleep_hours", 7.5),
                "unit": "hrs",
                "is_adverse": current_metrics["sleep_hours"] < baseline_metrics.get("sleep_hours", 7.5)
            },
            {
                "key": "assignment_delay",
                "label": "Assignment Delay",
                "penalty": penalties.get("delay", 0),
                "current": current_metrics["assignment_delay"],
                "baseline": baseline_metrics.get("assignment_delay", 0.0),
                "unit": "days",
                "is_adverse": current_metrics["assignment_delay"] > baseline_metrics.get("assignment_delay", 0.0)
            },
            {
                "key": "attendance",
                "label": "Class Attendance",
                "penalty": penalties.get("attendance", 0),
                "current": current_metrics["attendance"],
                "baseline": baseline_metrics.get("attendance", 90.0),
                "unit": "%",
                "is_adverse": current_metrics["attendance"] < baseline_metrics.get("attendance", 90.0)
            },
            {
                "key": "workload",
                "label": "Workload Pressure",
                "penalty": penalties.get("workload", 0),
                "current": current_metrics["workload"],
                "baseline": baseline_metrics.get("workload", 3.0),
                "unit": "lvl",
                "is_adverse": current_metrics["workload"] > baseline_metrics.get("workload", 3.0)
            },
            {
                "key": "screen_time",
                "label": "Screen Time",
                "penalty": penalties.get("screen", 0),
                "current": current_metrics["screen_time"],
                "baseline": baseline_metrics.get("screen_time", 3.5),
                "unit": "hrs",
                "is_adverse": current_metrics["screen_time"] > baseline_metrics.get("screen_time", 3.5)
            },
            {
                "key": "study_hours",
                "label": "Study Consistency",
                "penalty": penalties.get("study", 0),
                "current": current_metrics["study_hours"],
                "baseline": baseline_metrics.get("study_hours", 4.0),
                "unit": "hrs",
                "is_adverse": current_metrics["study_hours"] < baseline_metrics.get("study_hours", 4.0)
            }
        ]

        total_penalty = sum(f["penalty"] for f in features_meta)
        attributions = []

        for f in features_meta:
            penalty = f["penalty"]
            diff = f["current"] - f["baseline"]
            
            if total_penalty > 0:
                impact_pct = round((penalty / total_penalty) * 100, 1)
            else:
                # Default baseline contribution
                impact_pct = 0.0

            if f["is_adverse"] and penalty > 0:
                direction = "risk_increase"
                sign = "+"
            elif not f["is_adverse"] and abs(diff) > 0:
                direction = "protective"
                sign = "-"
                impact_pct = min(25.0, round(abs(diff) * 5, 1))
            else:
                direction = "neutral"
                sign = ""
                impact_pct = 0.0

            attributions.append({
                "feature": f["key"],
                "label": f["label"],
                "current_val": round(f["current"], 1),
                "baseline_val": round(f["baseline"], 1),
                "diff": round(diff, 1),
                "unit": f["unit"],
                "penalty_score": round(penalty, 1),
                "impact_percentage": impact_pct,
                "display_impact": f"{sign}{impact_pct}%",
                "direction": direction
            })

        # Sort with highest risk accelerators first
        attributions.sort(key=lambda x: (x["direction"] == "risk_increase", x["impact_percentage"]), reverse=True)
        return attributions

    def _generate_actionable_recommendations(
        self,
        risk_level: str,
        risk_score: int,
        c_sleep: float,
        b_sleep: float,
        c_delay: float,
        c_screen: float,
        b_screen: float,
        c_attendance: float,
        c_study: float,
        b_study: float,
        c_workload: float
    ) -> List[Dict[str, Any]]:
        """
        Dynamically generates 2-3 personalized, quantitative recovery action items.
        """
        actions = []

        if risk_level == "High":
            # High urgency actions
            if c_sleep < 6.5:
                target_sleep = max(6.5, round(b_sleep, 1))
                actions.append({
                    "id": "rec_sleep",
                    "title": "Sleep Recovery Target",
                    "description": f"Target {target_sleep} hours of sleep over the next 2 nights to lower risk score below 50%.",
                    "impact": "High Recovery Impact (-25% Risk)",
                    "category": "Rest & Well-being",
                    "completed": False
                })

            if c_delay > 0:
                actions.append({
                    "id": "rec_assignments",
                    "title": "Clear Overdue Submissions",
                    "description": f"Submit {int(c_delay)} delayed assignment(s) before this weekend to remove late-penalty anomaly flags.",
                    "impact": "Immediate Academic Impact (-20% Risk)",
                    "category": "Coursework",
                    "completed": False
                })

            if c_screen > 5.5:
                actions.append({
                    "id": "rec_screen",
                    "title": "Digital Detox Window",
                    "description": f"Limit recreational screen time to under {round(b_screen + 0.5, 1)} hrs tomorrow evening with 30-min offline intervals.",
                    "impact": "Stress Reduction (-15% Risk)",
                    "category": "Lifestyle Routine",
                    "completed": False
                })

            if len(actions) < 2:
                actions.append({
                    "id": "rec_workload",
                    "title": "Workload Rebalancing",
                    "description": "Break down high-workload modules into 25-minute Pomodoro focus sprints with 5-minute restorative breaks.",
                    "impact": "Cognitive Load Relief",
                    "category": "Study Strategy",
                    "completed": False
                })

        elif risk_level == "Moderate":
            if c_sleep < 7.0:
                actions.append({
                    "id": "rec_sleep",
                    "title": "Stabilize Sleep Schedule",
                    "description": f"Target at least {round(max(7.0, b_sleep), 1)} hrs sleep tonight to align with your personal baseline ({b_sleep} hrs).",
                    "impact": "Moderate Recovery Impact (-18% Risk)",
                    "category": "Rest & Well-being",
                    "completed": False
                })

            if c_screen > b_screen + 1.0:
                actions.append({
                    "id": "rec_screen",
                    "title": "Reduce Screen Fatigue",
                    "description": f"Reduce daily non-academic screen time by 1.5 hours and implement 10-minute eye rest breaks.",
                    "impact": "Fatigue Mitigation (-12% Risk)",
                    "category": "Lifestyle Routine",
                    "completed": False
                })

            if c_study < b_study - 1.0:
                actions.append({
                    "id": "rec_study",
                    "title": "Reinforce Study Routine",
                    "description": f"Schedule a focused {round(b_study, 1)}-hour review session to maintain regular academic momentum.",
                    "impact": "Consistency Booster",
                    "category": "Coursework",
                    "completed": False
                })

            if len(actions) < 2:
                actions.append({
                    "id": "rec_attendance",
                    "title": "Maintain Class Presence",
                    "description": "Ensure 100% attendance in upcoming scheduled lectures to protect course standing.",
                    "impact": "Protective Baseline Factor",
                    "category": "Academic Health",
                    "completed": False
                })

        else:
            # Low Risk - Maintenance Actions
            actions.append({
                "id": "rec_maintain",
                "title": "Maintain Baseline Balance",
                "description": f"Your current routine matches your healthy baseline ({round(c_sleep, 1)}h sleep, {round(c_study, 1)}h study). Keep up the steady pace!",
                "impact": "Optimal Risk Level (< 40%)",
                "category": "Routine Maintenance",
                "completed": False
            })
            actions.append({
                "id": "rec_prevent",
                "title": "Proactive Weekly Planning",
                "description": "Review upcoming semester deadlines today to prevent assignment congestion during exam cycles.",
                "impact": "Preventive Planning",
                "category": "Academic Strategy",
                "completed": False
            })

        return actions[:3]

# Instantiate global engine instance
risk_engine = AIBehaviourRiskEngine()

