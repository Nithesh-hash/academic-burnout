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

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "reasons": reasons,
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

# Instantiate global engine instance
risk_engine = AIBehaviourRiskEngine()
