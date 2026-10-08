# 🎓 Adaptive AI Academic Behaviour Risk & Burnout Monitoring System (`EduRisk AI`)

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://vitejs.dev)
[![Scikit-Learn](https://img.shields.io/badge/ML-Isolation%20Forest%20%2B%20SHAP-F7931E.svg?logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![Privacy Shield](https://img.shields.io/badge/Privacy-Zero--PII%20Client%20Anonymized-10B981.svg)](#-6-privacy--ethical-ai-principles)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **EduRisk AI** is an intelligent, privacy-first, machine learning academic behaviour monitoring and burnout prevention platform. It detects student fatigue, academic risk, and lifestyle routine anomalies early without optical cameras, video feeds, or invasive biometric tracking.

---

## 📑 Table of Contents
1. [Project Mission & Problem Statement](#-1-project-mission--problem-statement)
2. [Quick Start: Running the System](#-2-quick-start-running-the-system)
   - [Method 1: One-Click Desktop Launcher (Recommended)](#method-1-one-click-desktop-launcher-recommended)
   - [Method 2: Development Mode (Two Terminals)](#method-2-development-mode-two-terminals)
3. [Default User Credentials](#-3-default-user-credentials)
4. [Architecture & Technology Stack](#-4-architecture--technology-stack)
5. [AI & Machine Learning Engine Deep-Dive](#-5-ai--machine-learning-engine-deep-dive)
6. [Complete Feature & UI Walkthrough](#-6-complete-feature--ui-walkthrough)
7. [Privacy & Ethical AI Principles](#-7-privacy--ethical-ai-principles)
8. [API Reference Documentation](#-8-api-reference-documentation)
9. [Step-by-Step Demo Flow](#-9-step-by-step-demo-flow)
10. [Project Directory Structure](#-10-project-directory-structure)

---

## 🎯 1. Project Mission & Problem Statement

### 🛑 The Problem with Existing Academic Monitoring
Traditional academic surveillance and proctoring tools rely on **optical camera streams, facial emotion detection, audio recording, and keystroke logging**. These tools suffer from severe limitations:
- **Intrusive & Anxiety-Inducing:** Constant camera monitoring creates cognitive pressure and mistrust.
- **Privacy & Compliance Violations:** Storing biometric and facial landmark data creates security vulnerabilities.
- **Reactive, Not Proactive:** They only trigger flags during exam sessions rather than understanding progressive academic fatigue or lifestyle burnout over weeks.

### 💡 The Solution: EduRisk AI
**EduRisk AI** replaces invasive surveillance with an **explainable, relative-deviation AI model**. It monitors self-reported study habits, sleep consistency, assignment deadlines, and workload levels against a **personalized student baseline**.

---

## 🚀 2. Quick Start: Running the System

You have two primary ways to run the EduRisk AI platform depending on your needs.

### Method 1: One-Click Desktop Launcher (Recommended)
This method is best if you have already built the frontend (`npm run build`) and want to launch the system as a unified application.
```powershell
# From the root directory:
python desktop_app.py
```
**What happens:** 
- `desktop_app.py` automatically finds an available free port.
- It starts the FastAPI backend server on that port.
- The FastAPI backend serves the pre-built React frontend as static files.
- It automatically opens your default web browser to the application URL.
- *Note: This script is also fully compatible with PyInstaller, allowing you to bundle the entire system into a single executable `.exe` file.*

### Method 2: Development Mode (Two Terminals)
Whenever you start actively developing or modifying code on this project, use this method to enable hot-reloading:

**🔹 Terminal 1: Start Backend API (FastAPI)**
```powershell
cd backend
# Activate virtual environment if necessary: .venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```
* **Backend API Base URL:** `http://localhost:8000`
* **Interactive OpenAPI Swagger Docs:** `http://localhost:8000/docs`

**🔹 Terminal 2: Start Frontend Application (React + Vite)**
```powershell
cd frontend
npm install # if not installed
npm run dev
```
* **Frontend Web Application URL:** `http://localhost:5173`

---

## 🔑 3. Default User Credentials

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

## 🏗️ 4. Architecture & Technology Stack

EduRisk AI is built with modern, scalable, and resilient technologies.

*   **Backend Framework:** FastAPI, Python, Uvicorn (Fast, asynchronous API)
*   **Frontend Framework:** React 18, Vite 5, TailwindCSS (Modern, reactive UI)
*   **Database (Hybrid Approach):** 
    *   **Primary:** MongoDB (`motor` async driver)
    *   **Automatic Fallback:** Local JSON Collection Engine (stored in `backend/data/`). If MongoDB fails to connect or isn't installed, the system seamlessly falls back to saving data locally, ensuring the app never crashes.
*   **Machine Learning:** Scikit-Learn (Isolation Forest), Joblib, NumPy, Pandas
*   **Visualizations:** Recharts for dynamic frontend charts
*   **Security:** Passlib for password hashing, Python-Jose for JWT token authentication

---

## 🧠 5. AI & Machine Learning Engine Deep-Dive

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
Instead of comparing students against static global averages (e.g. demanding every student sleep exactly 8 hours), the system calculates a rolling average. Risk penalties are triggered only when the student deviates significantly from **their own** healthy routine.

### 🎯 C. SHAP Feature Attribution Model
EduRisk AI decomposes the final anomaly score into individual percentage contributions:
*   **Risk Accelerators (Red +%):** Factors contributing most to the burnout score (e.g. +29.2% Assignment Delay, +19.1% Sleep Reduction).
*   **Protective Factors (Green -%):** Factors keeping the score stable (e.g. -12% High Attendance).

### 📝 D. Dynamic Action Plan Generation
Based on the top driving SHAP factors and current risk tier, the AI engine synthesizes 2–3 quantitative recovery milestones (e.g., *"Target 7.5 hours of sleep over the next 2 nights to reduce risk score below 50%"*).

---

## 🖥️ 6. Complete Feature & UI Walkthrough

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

## 🛡️ 7. Privacy & Ethical AI Principles

* 🚫 **Zero Camera Access:** Never requests camera permissions, optical video streams, or background capture.
* 🚫 **Zero Biometric Scanning:** No facial landmark tracking, eye movement tracking, or emotion classification.
* 🔒 **Self-Reported & Verifiable:** All calculations are transparent, explainable via SHAP scores, and downloadable as audit logs.
* 🛡️ **Client-Level Isolation:** Data belongs to the student and is protected by secure JWT token authorization.

---

## 📡 8. API Reference Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate student & issue JWT Bearer token |
| `POST` | `/api/auth/register` | Register a new student profile |
| `GET` | `/api/auth/me` | Fetch active authenticated user profile |
| `GET` | `/api/health` | System health check and current database mode |
| `POST` | `/api/behaviour` | Log daily behaviour metrics & compute instant risk |
| `GET` | `/api/behaviour-history` | Get historical behaviour records for trend charts |
| `POST` | `/api/behaviour/seed` | Seed 14-day realistic sample demo data |
| `POST` | `/api/analyze-risk` | Compute AI risk score, SHAP attributions, & action plan |
| `GET` | `/api/risk-history` | Get past risk assessments & audit trail |
| `GET` | `/api/baseline` | Retrieve student's calibrated baseline metrics |
| `POST` | `/api/baseline/reset` | Reset historic records to start a new semester baseline |

---

## 🚀 9. Step-by-Step Demo Flow

1. **Start the Application:** Run `desktop_app.py` or use the dual-terminal setup for local development.
2. **Log In:** Use username **`Nithesh Kumar T`** and password **`Nithesh@06`** (or click *Auto-fill*).
3. **Load 14-Day Sample Demo:**
   - Click **"Load 14-Day Sample Demo"** on the dashboard.
   - Watch the trend charts populate with a transition from healthy baseline to high-workload exam pressure.
4. **Inspect AI Explanation & SHAP Attributions:** Observe the SHAP horizontal chart showing how late assignments and sleep reduction accelerate the risk score.
5. **Check Recovery Tasks:** Review the **AI Actionable Recommendations** card and check off recovery tasks.
6. **Log Today's Entry:** Click **"Log Behaviour"**, adjust sliders using the `-` / `+` counter buttons, and submit.
7. **Export Audit Log or Reset Baseline:** Click **"Baseline Controls & Export"** in the top navbar to download your full assessment history as a **CSV** or **JSON** file, or trigger a **"Start New Semester Baseline"** calibration.

---

## 📁 10. Project Directory Structure

```
academic-burnout/
├── desktop_app.py              # Launcher script, auto-browser, PyInstaller entrypoint
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
│   │   └── main.py                 # FastAPI application, static serving & provisioning
│   ├── scripts/
│   │   ├── init_users.py           # Database user verification script
│   │   └── test_auth.py            # Endpoint health check script
│   └── data/                       # Local JSON storage fallback (if MongoDB fails)
├── frontend/
│   ├── src/
│   │   ├── components/             # React UI components (Cards, Charts, Gauges)
│   │   ├── context/                # Authentication & session provider
│   │   ├── pages/                  # Main pages (Dashboard, Login, Audits)
│   │   ├── api.js                  # Axios API client & interceptors
│   │   └── App.jsx                 # React Router configuration
│   └── package.json
└── ml_model/
    └── isolation_forest.joblib     # Trained Isolation Forest scikit-learn model
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
