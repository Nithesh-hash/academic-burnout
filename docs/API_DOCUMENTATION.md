# REST API Documentation

Base URL: `http://localhost:8000`

---

## 1. Authentication Endpoints

### `POST /api/auth/register` (or `/register`)
Registers a new student profile and returns a JWT access token.

**Request Body**:
```json
{
  "name": "Alex Vance",
  "email": "alex@university.edu",
  "password": "securepassword123",
  "department": "Computer Science",
  "year": "3rd Year"
}
```

**Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1Ni...",
  "token_type": "bearer",
  "user": {
    "id": "uuid-v4-str",
    "name": "Alex Vance",
    "email": "alex@university.edu",
    "department": "Computer Science",
    "year": "3rd Year"
  }
}
```

---

### `POST /api/auth/login` (or `/login`)
Authenticates existing credentials.

**Request Body**:
```json
{
  "email": "alex@university.edu",
  "password": "securepassword123"
}
```

**Response (200 OK)**: Token object identical to register.

---

### `GET /api/auth/me` (or `/me`)
Returns authenticated student user details (Requires `Authorization: Bearer <JWT>`).

---

## 2. Student Behaviour Data Collection

### `POST /api/behaviour` (or `/behaviour`)
Submits a daily behaviour log record.

**Request Body**:
```json
{
  "study_hours": 4.5,
  "assignment_completion_status": "Completed",
  "assignment_delay": 0,
  "attendance": 95.0,
  "workload": 3,
  "sleep_duration": 7.5,
  "screen_time": 3.5,
  "break_frequency": 3,
  "date": "2026-07-21"
}
```

---

### `GET /api/behaviour-history` (or `/behaviour-history`)
Returns historical student behaviour records for trend chart visualization.

---

## 3. AI Risk Analysis

### `POST /api/analyze-risk` (or `/analyze-risk`)
Evaluates the student's risk level using Isolation Forest and Baseline deviation metrics.

**Response**:
```json
{
  "user_id": "uuid-v4",
  "risk_score": 65,
  "risk_level": "Moderate",
  "reasons": [
    "Sleep decreased by 2.5 hrs compared to normal baseline (5.0h vs 7.5h)",
    "Assignment delay increased by 2 days",
    "Workload level increased (Level 4 vs baseline 3.0)"
  ],
  "baseline": {
    "sleep_hours": 7.5,
    "study_hours": 4.0,
    "screen_time": 3.5,
    "workload": 3.0,
    "attendance": 95.0
  }
}
```

---

### `GET /api/risk-history` (or `/risk-history`)
Queries recent AI risk prediction scores and audit logs.

---

### `GET /api/baseline` (or `/baseline`)
Calculates and returns personalized average baseline stats for the student.
