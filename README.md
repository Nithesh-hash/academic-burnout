# 🎓 Adaptive AI Academic Behaviour Risk & Burnout Monitoring System (`EduRisk AI`)

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://vitejs.dev)
[![Scikit-Learn](https://img.shields.io/badge/ML-Isolation%20Forest%20%2B%20SHAP-F7931E.svg?logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![Privacy Shield](https://img.shields.io/badge/Privacy-Zero--PII%20Client%20Anonymized-10B981.svg)](#-4-privacy--ethical-ai-principles)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **EduRisk AI** is an intelligent, privacy-first, machine learning academic behaviour monitoring and burnout prevention platform. It detects student fatigue, academic risk, and lifestyle routine anomalies early without optical cameras, video feeds, or invasive biometric tracking.

---

## 📑 Table of Contents
1. [Quick Start: Running Locally Every Time](#-1-quick-start-how-to-run-locally-every-time)
2. [Default User Credentials](#-2-default-user-credentials)
3. [Project Mission & Problem Statement](#-3-project-mission--problem-statement)
4. [AI & Machine Learning Engine Deep-Dive](#-4-ai--machine-learning-engine-deep-dive)
5. [Complete Feature & UI Walkthrough](#-5-complete-feature--ui-walkthrough)
6. [Privacy & Ethical AI Principles](#-6-privacy--ethical-ai-principles)
7. [API Reference Documentation](#-7-api-reference-documentation)
8. [Step-by-Step Demo Flow](#-8-step-by-step-demo-flow)
9. [Tech Stack & Project Directory Structure](#-9-tech-stack--project-directory-structure)

---

## 🚀 1. Quick Start: How to Run Locally Every Time

Whenever you start working on this project on your machine, open **two separate terminal windows**:

### 🔹 Terminal 1: Start Backend API (FastAPI)
```powershell
cd academic-burnout\backend
python -m uvicorn app.main:app --reload --port 8000
```
* **Backend API Base URL:** `http://localhost:8000`
* **Interactive OpenAPI Swagger Docs:** `http://localhost:8000/docs`

---

### 🔹 Terminal 2: Start Frontend Application (React + Vite)
```powershell
cd academic-burnout\frontend
npm run dev
```
* **Frontend Web Application URL:** `http://localhost:5173`

---

## 🔑 2. Default User Credentials

The backend automatically initializes and syncs your account on startup:

| Parameter | Default Value |
| :--- | :--- |
| **Username** | `Nithesh Kumar T` |
| **Password** | `Nithesh@06` |
| **Alternative Demo Account** | `student1` / `demo1234` |
| **Department / Program** | M.Tech Integrated Software Engineering |
| **Academic Year** | 1st Year |

> 💡 *Tip: You can also click **"Auto-fill default credentials"** directly on the login page for 1-click authentication.*

---

## 🎯 3. Project Mission & Problem Statement

### 🛑 The Problem with Existing Academic Monitoring
Traditional academic surveillance and proctoring tools rely on **optical camera streams, facial emotion detection, audio recording, and keystroke logging**. These tools suffer from severe limitations:
- **Intrusive & Anxiety-Inducing:** Constant camera monitoring creates cognitive pressure and mistrust.
- **Privacy & Compliance Violations:** Storing biometric and facial landmark data creates security vulnerabilities.
- **Reactive, Not Proactive:** They only trigger flags during exam sessions rather than understanding progressive academic fatigue or lifestyle burnout over weeks.

### 💡 The Solution: EduRisk AI
**EduRisk AI** replaces invasive surveillance with an **explainable, relative-deviation AI model**. It monitors self-reported study habits, sleep consistency, assignment deadlines, and workload levels against a **personalized student baseline**.

---

## 🧠 4. AI & Machine Learning Engine Deep-Dive

```
                                 [ 6-Dimensional Daily Vector ]
            [ Sleep (h), Study (h), Screen (h), Delay (d), Attendance (%), Workload (1-5) ]
                                          │
            ┌─────────────────────────────┴─────────────────────────────┐
            ▼                                                           ▼
 ┌────────────────────────┐                                  ┌────────────────────────┐
 │ Isolation Forest Model │                                  │  Personalized Baseline │
 │  Unsupervised Anomaly  │                                  │   Relative Deviation   │
 └──────────┬─────────────┘                                  └──────────┬─────────────┘
            │ Anomaly Factor (0.0 - 1.0)                                │ Penalty Score (0 - 100)
            └─────────────────────────────┬─────────────────────────────┘
                                          ▼
                         ┌─────────────────────────────────┐
                         │   Composite Risk Score (0-100)  │
                         │    • Low Risk   (0 - 40%)       │
                         │    • Moderate   (41 - 70%)      │
                         │    • High Risk  (71 - 100%)     │
                         └────────────────┬────────────────┘
                                          │
            ┌─────────────────────────────┴─────────────────────────────┐
            ▼                                                           ▼
 ┌────────────────────────┐                                  ┌────────────────────────┐
 │ SHAP Impact Breakdown  │                                  │ Actionable Recovery    │
 │  Feature Attributions  │                                  │ Personalized Milestones│
 └────────────────────────┘                                  └────────────────────────┘
```

### 🌲 A. Isolation Forest Anomaly Detection
* **Model File:** `ml_model/isolation_forest.joblib`
* **Algorithm:** Isolation Forest isolates observations by randomly selecting a feature and a split value. Outliers (sudden extreme drop in sleep, spike in delays) require fewer partitions to isolate in recursive binary trees.
* **Decision Score:** The backend passes the 6D feature vector through `model.decision_function(vector)`. Anomaly scores are mapped to a normalized anomaly factor from `0.0` (standard) to `1.0` (severe anomaly).

### 📊 B. Personalized Rolling Baseline Calibration
Instead of comparing students against static global averages (e.g. demanding every student sleep exactly 8 hours), the system calculates a rolling average:
$$\text{Baseline}_{\text{metric}} = \frac{1}{N}\sum_{i=1}^N \text{metric}_i$$
Risk penalties are triggered only when the student deviates significantly from **their own** healthy routine:
- **Sleep Crash:** $\Delta\text{Sleep} = \text{Baseline}_{\text{sleep}} - \text{Current}_{\text{sleep}}$ (Heavy penalty if $>0.5\text{h}$ or $<5.0\text{h}$)
- **Assignment Backlog:** Penalty scales with pending days of delay.
- **Attendance Dip:** Drop from calibrated baseline percentage.
- **Workload Surge:** Increase above standard perceived workload.
- **Screen Time Spikes:** Excess non-academic device usage.

### 🎯 C. SHAP Feature Attribution Model
EduRisk AI decomposes the final anomaly score into individual percentage contributions:
- **Risk Accelerators ($\text{Red } +\%$):** Factors contributing most to the burnout score (e.g. $+29.2\%$ Assignment Delay, $+19.1\%$ Sleep Reduction).
- **Protective Factors ($\text{Green } -\%$):** Factors keeping the score stable (e.g. $-12\%$ High Attendance, $-10\%$ Steady Study Hours).

### 📝 D. Dynamic Action Plan Generation
Based on the top driving SHAP factors and current risk tier, the AI engine synthesizes 2–3 quantitative recovery milestones (e.g., *"Target 7.5 hours of sleep over the next 2 nights to reduce risk score below 50%"*).

---

## 🖥️ 5. Complete Feature & UI Walkthrough

| Component | Source File | Key Highlights |
| :--- | :--- | :--- |
| **Operational Status Bar** | `StatusBar.jsx` | Shows Total Days Logged, Baseline Calibration State (`Calibrated` vs `Calibrating`), and Active Privacy Mode. |
| **Risk Meter Gauge** | `RiskMeter.jsx` | Visual circular SVG gauge displaying composite risk (0–100%) and color-coded risk tier (Low, Moderate, High). |
| **SHAP Impact Breakdown** | `ExplanationCard.jsx` | Horizontal stacked progress bars displaying exact percentage contribution and current vs. baseline values for each metric. |
| **AI Actionable Plan Card** | `ActionPlanCard.jsx` | Checkable recovery tasks with local storage persistence and progress bars. |
| **Summary Metric Cards** | `Dashboard.jsx` | Five metric cards displaying Daily Study, Sleep Duration, Screen Time, Attendance %, and Workload Level. |
| **Personal Baseline Card** | `PersonalBaselineCard.jsx` | Shows calibrated target averages calculated from all historical student logs. |
| **Interactive Trend Charts** | `TrendCharts.jsx` | Recharts graphs with custom hover tooltips showing exact date-value pairs, baseline delta comparisons, and red/amber risk anomaly markers. |
| **Standardized Log Modal** | `LogBehaviourModal.jsx` | Standardized interactive range sliders and counter increment/decrement (`-` / `+`) buttons. |
| **Settings Drawer** | `SettingsDrawer.jsx` | Allows 1-click **CSV** and **JSON** audit log exports and "Start New Semester Baseline" reset. |
| **Risk Assessment Audit Log** | `RiskAnalysisPage.jsx` | Chronological audit table of all ML predictions, metric breakdowns, and privacy principles. |

---

## 🛡️ 6. Privacy & Ethical AI Principles

* 🚫 **Zero Camera Access:** Never requests camera permissions, optical video streams, or background capture.
* 🚫 **Zero Biometric Scanning:** No facial landmark tracking, eye movement tracking, or emotion classification.
* 🔒 **Self-Reported & Verifiable:** All calculations are transparent, explainable via SHAP scores, and downloadable as audit logs.
* 🛡️ **Client-Level Isolation:** Data belongs to the student and is protected by secure JWT token authorization.

---

## 📡 7. API Reference Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate student & issue JWT Bearer token |
| `POST` | `/api/auth/register` | Register a new student profile |
| `GET` | `/api/auth/me` | Fetch active authenticated user profile |
| `POST` | `/api/behaviour` | Log daily behaviour metrics & compute instant risk |
| `GET` | `/api/behaviour-history` | Get historical behaviour records for trend charts |
| `POST` | `/api/behaviour/seed` | Seed 14-day realistic sample demo data |
| `POST` | `/api/analyze-risk` | Compute AI risk score, SHAP attributions, & action plan |
| `GET` | `/api/risk-history` | Get past risk assessments & audit trail |
| `GET` | `/api/baseline` | Retrieve student's calibrated baseline metrics |
| `POST` | `/api/baseline/reset` | Reset historic records to start a new semester baseline |

---

## 🚀 8. Step-by-Step Demo Flow

1. **Start the Application:**
   - **Terminal 1:** `cd backend && python -m uvicorn app.main:app --reload --port 8000`
   - **Terminal 2:** `cd frontend && npm run dev`
2. **Log In:**
   - Open `http://localhost:5173`
   - Use username **`Nithesh Kumar T`** and password **`Nithesh@06`** (or click *Auto-fill*).
3. **Load 14-Day Sample Demo:**
   - Click **"Load 14-Day Sample Demo"** on the dashboard.
   - Watch the trend charts populate with a transition from healthy baseline to high-workload exam pressure.
4. **Inspect AI Explanation & SHAP Attributions:**
   - Observe the SHAP horizontal chart showing how late assignments and sleep reduction accelerate the risk score.
5. **Check Recovery Tasks:**
   - Review the **AI Actionable Recommendations** card and check off recovery tasks.
6. **Log Today's Entry:**
   - Click **"Log Behaviour"**, adjust sliders using the `-` / `+` counter buttons, and submit.
7. **Export Audit Log or Reset Baseline:**
   - Click **"Baseline Controls & Export"** in the top navbar to download your full assessment history as a **CSV** or **JSON** file, or trigger a **"Start New Semester Baseline"** calibration.

---

## 📁 9. Tech Stack & Project Directory Structure

### Tech Stack
- **Backend API:** FastAPI, Python 3.14/3.12, Uvicorn, Pydantic, Python-Jose, Passlib
- **Machine Learning:** Scikit-Learn (Isolation Forest), NumPy, Pandas, Joblib
- **Database:** MongoDB (`motor` async driver) + Automatic Fallback Local JSON Collection Engine
- **Frontend App:** React 18, Vite 5, TailwindCSS, Lucide React (Icons), Axios
- **Data Visualization:** Recharts (AreaCharts, LineCharts, ReferenceLines, Custom Tooltips)

### Directory Structure
```
academic-burnout/
├── backend/
│   ├── app/
│   │   ├── ml/
│   │   │   └── risk_engine.py      # Isolation Forest + SHAP attribution engine
│   │   ├── routers/
│   │   │   ├── auth.py             # User authentication & registration
│   │   │   ├── behaviour.py        # Daily behaviour logging & history seeding
│   │   │   └── risk.py             # Risk calculation, baseline & reset endpoints
│   │   ├── auth.py                 # JWT token creation & password hashing
│   │   ├── database.py             # MongoDB client + local fallback collection engine
│   │   ├── models.py               # Pydantic data schemas
│   │   └── main.py                 # FastAPI application & startup provisioning
│   ├── scripts/
│   │   ├── init_users.py           # Database user verification script
│   │   └── test_auth.py            # Endpoint health check script
│   └── data/                       # Local JSON storage fallback
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActionPlanCard.jsx       # Checkable AI actionable recommendations
│   │   │   ├── ExplanationCard.jsx      # SHAP feature impact attribution chart
│   │   │   ├── LogBehaviourModal.jsx    # Standardized slider & counter input modal
│   │   │   ├── Navbar.jsx               # Navigation & settings header
│   │   │   ├── PersonalBaselineCard.jsx # Baseline metric comparison overview
│   │   │   ├── RiskMeter.jsx            # Gauge chart for burnout risk
│   │   │   ├── SettingsDrawer.jsx       # Baseline reset & CSV/JSON export drawer
│   │   │   ├── StatusBar.jsx            # Operational metrics status bar
│   │   │   └── TrendCharts.jsx          # Interactive charts with custom tooltips
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Authentication & session provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx            # Main student dashboard
│   │   │   ├── Login.jsx                # User login page
│   │   │   ├── Register.jsx             # New student registration page
│   │   │   └── RiskAnalysisPage.jsx     # Risk audit log & privacy principles
│   │   ├── api.js                       # Axios API client & interceptors
│   │   └── App.jsx                      # React Router configuration
│   └── package.json
└── ml_model/
    └── isolation_forest.joblib          # Trained Isolation Forest scikit-learn model
```


🛠️ If You Make Future Code Changes:
Whenever you make changes to the React code or Python backend and want to update the .exe:

powershell
# 1. Build the updated frontend
cd c:\Users\tnith\OneDrive\Desktop\ai\academic-burnout\frontend
npm run build
# 2. Re-package the .exe
cd c:\Users\tnith\OneDrive\Desktop\ai\academic-burnout
python -m PyInstaller AcademicBurnoutAI.spec --clean --noconfirm
