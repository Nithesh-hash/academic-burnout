from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# User & Auth Models
class UserRegister(BaseModel):
    username: str = Field(..., example="alexvance")
    password: str = Field(..., min_length=3)
    name: Optional[str] = Field(None, example="Alex Vance")
    department: str = Field("M.Tech Integrated Software Engineering", example="M.Tech Integrated Software Engineering")
    year: str = Field("1st Year", example="3rd Year")

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    department: str
    year: str
    created_at: Optional[str] = None
    has_timetable: Optional[bool] = False
    timetable_url: Optional[str] = None

# Extracurricular Models
class ExtracurricularActivityCreate(BaseModel):
    name: str = Field(..., description="Name of the activity or club")
    day_of_week: str = Field(..., description="Monday, Tuesday, etc.")
    duration_hours: float = Field(..., ge=0, description="Hours spent per week")
    type: str = Field("Club", description="Club, Sport, Hobby, Work, etc.")

class ExtracurricularActivity(ExtracurricularActivityCreate):
    id: str
    user_id: str
    created_at: str

# Behaviour Input Model
class BehaviourRecordCreate(BaseModel):
    study_hours: float = Field(..., ge=0, le=24, description="Daily study hours")
    assignment_completion_status: str = Field("Completed", description="Completed, In Progress, Delayed")
    assignment_delay: int = Field(0, ge=0, description="Assignment delay in days")
    attendance: float = Field(..., ge=0, le=100, description="Attendance percentage")
    workload: int = Field(..., ge=1, le=5, description="Workload level from 1 (Very Low) to 5 (Extremely High)")
    sleep_duration: float = Field(..., ge=0, le=24, description="Sleep duration in hours")
    screen_time: float = Field(..., ge=0, le=24, description="Screen time in hours")
    break_frequency: int = Field(3, ge=0, description="Number of breaks taken per day")
    date: Optional[str] = None

class BehaviourRecord(BehaviourRecordCreate):
    id: str
    user_id: str
    timestamp: str

# Risk Analysis Response
class RiskPrediction(BaseModel):
    id: Optional[str] = None
    user_id: str
    risk_score: int
    risk_level: str  # Low, Moderate, High
    reasons: List[str]
    baseline: Dict[str, float]
    current_metrics: Dict[str, float]
    timestamp: str

# Personal Baseline Model
class BaselineProfile(BaseModel):
    user_id: str
    avg_sleep: float
    avg_study: float
    avg_screen: float
    avg_workload: float
    avg_attendance: float
    avg_delay: float
    total_records: int
