# Installation & Running Instructions

Project Directory: `C:\Users\tnith\.gemini\antigravity-ide\scratch\academic-risk-monitor`

---

## 1. Prerequisites
- **Python**: Version 3.9 or higher
- **Node.js**: Version 18 or higher
- **MongoDB** *(Optional)*: Community Server running on `mongodb://localhost:27017`.
  *(Note: If MongoDB is not running, the system automatically uses its local collection engine without crashing).*

---

## 2. Backend Setup & Running

1. **Navigate to the backend directory**:
   ```bash
   cd C:\Users\tnith\.gemini\antigravity-ide\scratch\academic-risk-monitor\backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Train / Initialize Machine Learning Model** *(Optional, auto-generated on startup if missing)*:
   ```bash
   python ../ml_model/train_baseline_model.py
   ```

4. **Start the FastAPI Backend Server**:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

Backend server will run at: `http://localhost:8000`
Interactive API Docs (Swagger UI): `http://localhost:8000/docs`

---

## 3. Frontend Setup & Running

1. **Navigate to the frontend directory**:
   ```bash
   cd C:\Users\tnith\.gemini\antigravity-ide\scratch\academic-risk-monitor\frontend
   ```

2. **Install Node modules**:
   ```bash
   npm install
   ```

3. **Launch Vite React Development Server**:
   ```bash
   npm run dev
   ```

Frontend Dashboard will run at: `http://localhost:5173`

---

## 4. Quick Testing & Demonstration

1. Open `http://localhost:5173` in your browser.
2. Click **"Fill Demo Credentials"** on the Login screen, or Register a new student profile.
3. Click the **"Load 14-Day Sample Demo"** button on the top right of the dashboard.
4. Watch the Dashboard populate with:
   - **Risk Gauge Score** (Low, Moderate, High indicator)
   - **AI Explanation Card** (itemizing sleep, workload, and attendance reasons)
   - **Personal Baseline Card** (showing student normal averages)
   - **Recharts Trend Graphs** (Study hours, sleep, screen time, attendance)
5. Click **"Log Today's Entry"** to enter custom daily parameters or try preset scenarios.
