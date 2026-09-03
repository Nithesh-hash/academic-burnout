# 🎓 Adaptive AI Academic Behaviour Risk & Burnout Monitoring System

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://vitejs.dev)
[![Scikit-Learn](https://img.shields.io/badge/ML-Isolation%20Forest%20%2B%20SHAP-F7931E.svg?logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![Privacy Shield](https://img.shields.io/badge/Privacy-Zero--PII%20Client%20Anonymized-10B981.svg)](#-privacy-architecture)

> **EduRisk AI** is a privacy-first, machine learning academic behaviour monitoring platform designed to detect student burnout risk and study anomalies early without optical surveillance, camera feeds, or intrusive biometric tracking.

---

## 🚀 Quick Start: How to Run Locally Every Time

Whenever you want to run the project locally on your machine, open **two separate terminal windows**:

### 🔹 Terminal 1: Start Backend API (FastAPI)
```powershell
cd academic-burnout\backend
python -m uvicorn app.main:app --reload --port 8000
```
* **Backend API URL:** `http://localhost:8000`
* **Interactive Swagger Docs:** `http://localhost:8000/docs`

---

### 🔹 Terminal 2: Start Frontend Application (React + Vite)
```powershell
cd academic-burnout\frontend
npm run dev
```
* **Frontend Web App URL:** `http://localhost:5173`

---

## 🔑 Default Login Credentials

The system automatically initializes and syncs your account on startup:

| Field | Value |
| :--- | :--- |
| **Username** | `Nithesh Kumar T` |
| **Password** | `Nithesh@06` |
| **Alternative Demo Account** | `student1` / `demo1234` |
| **Role & Department** | M.Tech Integrated Software Engineering (1st Year) |

> 💡 *Note: You can also click **"Auto-fill default credentials"** directly on the login page for instant 1-click access.*

---

## 🧠 Core AI & Machine Learning Architecture

```
                                  [ Daily Student Log ]
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
    ┌──────────────────────┐                                  ┌──────────────────────┐
    │   Isolation Forest   │                                  │  Personal Baseline   │
    │   Anomaly Detector   │                                  │  Relative Deviation  │
    └──────────┬───────────┘                                  └──────────┬───────────┘
               │                                                         │
               └────────────────────────────┬────────────────────────────┘
                                            ▼
                           ┌─────────────────────────────────┐
                           │    Combined Risk Score (0-100)  │
                           │   • Low    (0 - 40%)            │
                           │   • Moderate (41 - 70%)         │
                           │   • High   (71 - 100%)          │
                           └────────────────┬────────────────┘
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
    ┌──────────────────────┐                                  ┌──────────────────────┐
    │   SHAP Attribution   │                                  │  Dynamic Action Plan │
    │   Impact Breakdown   │                                  │  Personalized Tasks  │
    └──────────────────────┘                                  └──────────────────────┘
```

### 1. 🌲 Isolation Forest Anomaly Detection
* An unsupervised ensemble model (`ml_model/isolation_forest.joblib`) trained to detect abnormal multidimensional outlier vectors across 6 behavioral dimensions:
  1. `sleep_hours` (Daily sleep duration)
  2. `study_hours` (Daily focused study time)
  3. `screen_time` (Recreational/non-academic device usage)
  4. `assignment_delay` (Pending assignment backlog in days)
  5. `attendance` (Class attendance percentage)
  6. `workload` (Perceived workload pressure from 1 to 5)

### 2. 📊 Dynamic Personal Baseline Calibration
* Instead of penalizing students against arbitrary population averages, EduRisk AI builds a **personalized rolling baseline** for each individual student.
* Deviations are measured relative to the student's healthy routine (e.g. sleep drop $\Delta \text{Sleep} = \text{Baseline} - \text{Current}$).

### 3. 🎯 SHAP-Style Feature Impact Attributions
* Mathematically decomposes the risk score into exact percentage contributions for each driving feature (e.g., `+29.2% Assignment Delay`, `+19.1% Sleep Reduction`).
* Distinguishes between **Risk Accelerators** (driving burnout) and **Protective Factors** (reducing risk).

### 4. 📝 Dynamic Actionable Recommendations
* Automatically synthesizes 2–3 quantitative recovery milestones (e.g. *"Target 7.5 hours of sleep over next 2 nights to lower risk score below 50%"*).
* Includes checkable action items with progress tracking.

---

## ✨ Features & UI Components

| Feature | Description |
| :--- | :--- |
| **Interactive Risk Meter** | Visual circular gauge showing real-time risk index (0–100%) and risk tier. |
| **SHAP Impact Chart** | Horizontal stacked progress bars displaying feature impact percentages. |
| **AI Action Plan Card** | Checkable recovery tasks with interactive progress completion tracking. |
| **Consolidated Status Bar** | Operational status showing total days logged, baseline calibration readiness, and privacy mode. |
| **Interactive Trend Charts** | Recharts graphs with custom hover tooltips showing exact date-value pairs, baseline comparison deltas, and risk anomaly markers. |
| **Standardized Log Modal** | Uniform sliders and decrement/increment (`-` / `+`) counter buttons. |
| **Baseline Reset & Audit Export** | Slide-over drawer to reset term baselines and download complete assessment logs in **CSV** or **JSON**. |

---

## 🛡️ Privacy Architecture Guarantees

* 🚫 **No Optical Surveillance:** Never requests camera permissions, optical video streams, or background capture.
* 🚫 **No Facial Recognition:** Zero biometric tracking, eye-tracking, or emotion classification.
* 🔒 **Localized Relative Analysis:** Risk is calculated strictly from self-reported study and lifestyle logs compared against personal baseline history.

---

## 📡 API Reference Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & return JWT Bearer token |
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

## 📁 Project Structure

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
