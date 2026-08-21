# Adaptive AI-Based Academic Behaviour Risk Monitoring System

## System Architecture Overview

```
                      +-----------------------------------+
                      |      React.js + Vite Dashboard    |
                      |  (Tailwind CSS, Recharts, Router) |
                      +-----------------+-----------------+
                                        |
                                        | HTTP / JWT Auth REST API
                                        v
                      +-----------------+-----------------+
                      |       Python FastAPI Backend      |
                      |  (Routers: Auth, Behaviour, Risk) |
                      +--------+----------------+---------+
                               |                |
             Async Motor Client|                | Machine Learning Vector
                               v                v
                      +--------+----+      +----+------------------+
                      | MongoDB     |      | AI Behaviour Risk     |
                      | Database    |      | Engine                |
                      +-------------+      | (Isolation Forest +   |
                                           | Baseline Deviation)   |
                                           +-----------------------+
```

---

## Technical Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS & Lucide Icons
- **Routing**: React Router v6
- **Data Visualization**: Recharts (Study, Sleep, Screen Time & Attendance Trends)

### Backend
- **Framework**: Python FastAPI
- **Authentication**: JWT Tokens (PyJWT) + SHA256/Salt Password Hashing
- **Server**: Uvicorn ASGI Server

### Database Design (MongoDB Collections)
1. `Users`: User authentication credentials & profile metadata.
2. `StudentProfiles`: Department, Year, baseline state flag.
3. `BehaviourRecords`: Daily academic & lifestyle entries (sleep, study, screen time, attendance, workload, assignment delay).
4. `RiskPredictions`: Historical AI risk analysis scores, levels, and natural language explanations.

*(Note: Features dynamic fallback engine to local collection store if MongoDB service is not started).*

### AI Engine (Machine Learning)
- **Algorithm**: `Isolation Forest` (Scikit-Learn)
- **Input Parameters**:
  - `sleep_hours` (0 - 16 hrs)
  - `study_hours` (0 - 16 hrs)
  - `screen_time` (0 - 16 hrs)
  - `assignment_delay` (0 - 14 days)
  - `attendance` (0 - 100%)
  - `workload` (Level 1 - 5)
- **Output**:
  - **Risk Score**: 0 to 100
  - **Risk Levels**:
    - **0 - 40**: Low Risk
    - **41 - 70**: Moderate Risk
    - **71 - 100**: High Risk
  - **Natural Language Explanations**: Itemized rationale detailing relative deviations from normal baseline averages.

---

## Strict Privacy Guarantees
- ❌ **NO Camera / Optical Access**
- ❌ **NO Facial Recognition / Emotion Detection**
- ❌ **NO Sentiment Analysis or Web Monitoring**
- ❌ **NO Medical Diagnosis**
- ✅ **100% Privacy-Friendly**: Monitors only self-reported academic & lifestyle habit parameters.
