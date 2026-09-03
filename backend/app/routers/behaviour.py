import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.models import BehaviourRecordCreate, BehaviourRecord
from app.auth import get_current_user
from app.database import db_manager
from app.ml.risk_engine import risk_engine

router = APIRouter(tags=["Student Behaviour"])

@router.post("/behaviour")
@router.post("/api/behaviour")
async def create_behaviour_record(
    record_in: BehaviourRecordCreate,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    behaviour_col = db_manager.get_collection("BehaviourRecords")
    risk_col = db_manager.get_collection("RiskPredictions")
    
    timestamp = datetime.utcnow().isoformat()
    record_date = record_in.date or datetime.utcnow().strftime("%Y-%m-%d")
    record_id = str(uuid.uuid4())
    
    doc = {
        "_id": record_id,
        "id": record_id,
        "user_id": user_id,
        "study_hours": record_in.study_hours,
        "assignment_completion_status": record_in.assignment_completion_status,
        "assignment_delay": record_in.assignment_delay,
        "attendance": record_in.attendance,
        "workload": record_in.workload,
        "sleep_duration": record_in.sleep_duration,
        "screen_time": record_in.screen_time,
        "break_frequency": record_in.break_frequency,
        "sleep_hours": record_in.sleep_duration,  # Alias for ML engine
        "date": record_date,
        "timestamp": timestamp
    }
    
    await behaviour_col.insert_one(doc)
    
    # Retrieve user's historical records to evaluate personalized risk
    history_cursor = behaviour_col.find({"user_id": user_id})
    history_records = await history_cursor.to_list(length=100)
    
    # Run AI Behaviour Analysis Engine
    current_dict = {
        "sleep_hours": record_in.sleep_duration,
        "study_hours": record_in.study_hours,
        "screen_time": record_in.screen_time,
        "assignment_delay": record_in.assignment_delay,
        "attendance": record_in.attendance,
        "workload": record_in.workload
    }
    
    risk_result = risk_engine.analyze_risk(current_dict, history_records)
    
    # Save Risk Prediction
    risk_id = str(uuid.uuid4())
    risk_doc = {
        "_id": risk_id,
        "id": risk_id,
        "user_id": user_id,
        "behaviour_record_id": record_id,
        "risk_score": risk_result["risk_score"],
        "risk_level": risk_result["risk_level"],
        "reasons": risk_result["reasons"],
        "shap_attributions": risk_result.get("shap_attributions", []),
        "action_recommendations": risk_result.get("action_recommendations", []),
        "baseline": risk_result["baseline"],
        "current_metrics": risk_result["current_metrics"],
        "date": record_date,
        "timestamp": timestamp
    }
    await risk_col.insert_one(risk_doc)
    
    return {
        "message": "Daily behaviour record saved successfully.",
        "record": doc,
        "analysis": risk_result
    }

@router.get("/behaviour-history")
@router.get("/api/behaviour-history")
async def get_behaviour_history(
    limit: int = 30,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    behaviour_col = db_manager.get_collection("BehaviourRecords")
    
    cursor = behaviour_col.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
    records = await cursor.to_list(length=limit)
    
    # Reverse to return chronological order for charts
    records = sorted(records, key=lambda x: x.get("timestamp", ""))
    return records

@router.post("/api/behaviour/seed")
async def seed_sample_history(current_user: dict = Depends(get_current_user)):
    """Populates 14 days of realistic sample behaviour records for rich dashboard demo."""
    user_id = current_user["id"]
    behaviour_col = db_manager.get_collection("BehaviourRecords")
    risk_col = db_manager.get_collection("RiskPredictions")
    
    # Baseline pattern for days 1-8, then progressive stress pattern for days 9-14
    sample_data = [
        {"day_offset": 13, "sleep": 7.5, "study": 4.0, "screen": 3.2, "delay": 0, "attend": 96.0, "workload": 2},
        {"day_offset": 12, "sleep": 7.8, "study": 4.2, "screen": 3.5, "delay": 0, "attend": 95.0, "workload": 3},
        {"day_offset": 11, "sleep": 7.2, "study": 3.8, "screen": 3.8, "delay": 0, "attend": 94.0, "workload": 3},
        {"day_offset": 10, "sleep": 7.0, "study": 4.5, "screen": 3.0, "delay": 0, "attend": 98.0, "workload": 2},
        {"day_offset": 9,  "sleep": 8.0, "study": 4.0, "screen": 3.4, "delay": 0, "attend": 96.0, "workload": 3},
        {"day_offset": 8,  "sleep": 7.4, "study": 3.9, "screen": 3.6, "delay": 0, "attend": 95.0, "workload": 3},
        {"day_offset": 7,  "sleep": 7.1, "study": 4.1, "screen": 4.0, "delay": 0, "attend": 92.0, "workload": 3},
        {"day_offset": 6,  "sleep": 6.8, "study": 3.5, "screen": 4.5, "delay": 1, "attend": 90.0, "workload": 4},
        {"day_offset": 5,  "sleep": 6.2, "study": 3.0, "screen": 5.2, "delay": 1, "attend": 88.0, "workload": 4},
        {"day_offset": 4,  "sleep": 5.5, "study": 2.5, "screen": 6.0, "delay": 2, "attend": 82.0, "workload": 4},
        {"day_offset": 3,  "sleep": 4.8, "study": 2.0, "screen": 7.2, "delay": 3, "attend": 78.0, "workload": 5},
        {"day_offset": 2,  "sleep": 4.2, "study": 1.5, "screen": 8.0, "delay": 4, "attend": 72.0, "workload": 5},
        {"day_offset": 1,  "sleep": 4.5, "study": 1.8, "screen": 7.5, "delay": 4, "attend": 70.0, "workload": 5},
        {"day_offset": 0,  "sleep": 5.0, "study": 2.2, "screen": 6.8, "delay": 3, "attend": 75.0, "workload": 4},
    ]
    
    created_count = 0
    history_accumulator = []
    
    for item in sample_data:
        record_date = (datetime.utcnow() - timedelta(days=item["day_offset"])).strftime("%Y-%m-%d")
        timestamp = (datetime.utcnow() - timedelta(days=item["day_offset"])).isoformat()
        rec_id = str(uuid.uuid4())
        
        doc = {
            "_id": rec_id,
            "id": rec_id,
            "user_id": user_id,
            "study_hours": item["study"],
            "assignment_completion_status": "Delayed" if item["delay"] > 0 else "Completed",
            "assignment_delay": item["delay"],
            "attendance": item["attend"],
            "workload": item["workload"],
            "sleep_duration": item["sleep"],
            "sleep_hours": item["sleep"],
            "screen_time": item["screen"],
            "break_frequency": 3,
            "date": record_date,
            "timestamp": timestamp
        }
        await behaviour_col.insert_one(doc)
        history_accumulator.append(doc)
        
        # Risk analysis
        current_dict = {
            "sleep_hours": item["sleep"],
            "study_hours": item["study"],
            "screen_time": item["screen"],
            "assignment_delay": item["delay"],
            "attendance": item["attend"],
            "workload": item["workload"]
        }
        
        analysis = risk_engine.analyze_risk(current_dict, history_accumulator)
        risk_id = str(uuid.uuid4())
        risk_doc = {
            "_id": risk_id,
            "id": risk_id,
            "user_id": user_id,
            "behaviour_record_id": rec_id,
            "risk_score": analysis["risk_score"],
            "risk_level": analysis["risk_level"],
            "reasons": analysis["reasons"],
            "shap_attributions": analysis.get("shap_attributions", []),
            "action_recommendations": analysis.get("action_recommendations", []),
            "baseline": analysis["baseline"],
            "current_metrics": analysis["current_metrics"],
            "date": record_date,
            "timestamp": timestamp
        }
        await risk_col.insert_one(risk_doc)
        created_count += 1

    return {"message": f"Successfully seeded {created_count} historical behaviour and risk records."}
