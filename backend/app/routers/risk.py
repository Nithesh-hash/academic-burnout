import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.auth import get_current_user
from app.database import db_manager
from app.ml.risk_engine import risk_engine
from app.models import BehaviourRecordCreate

router = APIRouter(tags=["AI Risk Analysis"])

@router.post("/analyze-risk")
@router.post("/api/analyze-risk")
async def analyze_current_risk(
    record_in: Optional[BehaviourRecordCreate] = None,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    behaviour_col = db_manager.get_collection("BehaviourRecords")
    risk_col = db_manager.get_collection("RiskPredictions")
    
    # Retrieve user's historical records
    history_cursor = behaviour_col.find({"user_id": user_id})
    history_records = await history_cursor.to_list(length=100)
    
    if record_in:
        current_metrics = {
            "sleep_hours": record_in.sleep_duration,
            "study_hours": record_in.study_hours,
            "screen_time": record_in.screen_time,
            "assignment_delay": record_in.assignment_delay,
            "attendance": record_in.attendance,
            "workload": record_in.workload
        }
    elif history_records:
        # Use latest logged record
        latest = sorted(history_records, key=lambda x: x.get("timestamp", ""))[-1]
        current_metrics = {
            "sleep_hours": latest.get("sleep_duration", latest.get("sleep_hours", 7.5)),
            "study_hours": latest.get("study_hours", 4.0),
            "screen_time": latest.get("screen_time", 3.5),
            "assignment_delay": latest.get("assignment_delay", 0),
            "attendance": latest.get("attendance", 95.0),
            "workload": latest.get("workload", 3)
        }
    else:
        # Default baseline initial check
        current_metrics = {
            "sleep_hours": 7.5,
            "study_hours": 4.0,
            "screen_time": 3.5,
            "assignment_delay": 0,
            "attendance": 95.0,
            "workload": 3
        }

    analysis_result = risk_engine.analyze_risk(current_metrics, history_records)
    
    return {
        "user_id": user_id,
        "risk_score": analysis_result["risk_score"],
        "risk_level": analysis_result["risk_level"],
        "reasons": analysis_result["reasons"],
        "shap_attributions": analysis_result.get("shap_attributions", []),
        "action_recommendations": analysis_result.get("action_recommendations", []),
        "baseline": analysis_result["baseline"],
        "current_metrics": analysis_result["current_metrics"],
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/risk-history")
@router.get("/api/risk-history")
async def get_risk_history(
    limit: int = 50,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    risk_col = db_manager.get_collection("RiskPredictions")
    
    cursor = risk_col.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
    records = await cursor.to_list(length=limit)
    
    # Sort chronological
    records = sorted(records, key=lambda x: x.get("timestamp", ""))
    return records

@router.get("/baseline")
@router.get("/api/baseline")
async def get_personal_baseline(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    behaviour_col = db_manager.get_collection("BehaviourRecords")
    
    history_cursor = behaviour_col.find({"user_id": user_id})
    history_records = await history_cursor.to_list(length=100)
    
    baseline = risk_engine.calculate_baseline(history_records)
    
    return {
        "user_id": user_id,
        "student_name": current_user["name"],
        "department": current_user.get("department", "N/A"),
        "year": current_user.get("year", "N/A"),
        "baseline": baseline,
        "sample_size": len(history_records)
    }

@router.post("/api/baseline/reset")
@router.post("/baseline/reset")
async def reset_student_baseline(current_user: dict = Depends(get_current_user)):
    """
    Clears current semester historical behaviour and risk predictions
    to initiate a fresh baseline calibration cycle.
    """
    user_id = current_user["id"]
    behaviour_col = db_manager.get_collection("BehaviourRecords")
    risk_col = db_manager.get_collection("RiskPredictions")

    del_b = await behaviour_col.delete_many({"user_id": user_id})
    del_r = await risk_col.delete_many({"user_id": user_id})

    return {
        "message": "Historic baseline successfully reset for a new semester.",
        "deleted_behaviour_records": getattr(del_b, "deleted_count", 0),
        "deleted_risk_predictions": getattr(del_r, "deleted_count", 0),
        "timestamp": datetime.utcnow().isoformat()
    }

@router.delete("/risk-history/{record_id}")
@router.delete("/api/risk-history/{record_id}")
async def delete_risk_record(
    record_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Deletes a specific risk prediction entry and optionally its associated behaviour record.
    """
    user_id = current_user["id"]
    risk_col = db_manager.get_collection("RiskPredictions")
    behaviour_col = db_manager.get_collection("BehaviourRecords")

    # Find the risk document
    risk_doc = None
    if hasattr(risk_col, "find_one"):
        risk_doc = await risk_col.find_one({"id": record_id, "user_id": user_id})
        if not risk_doc:
            risk_doc = await risk_col.find_one({"_id": record_id, "user_id": user_id})

    # Delete the risk record
    del_r1 = await risk_col.delete_many({"id": record_id, "user_id": user_id})
    del_r2 = await risk_col.delete_many({"_id": record_id, "user_id": user_id})

    # If linked behaviour record exists, delete it too
    if risk_doc:
        beh_id = risk_doc.get("behaviour_record_id")
        timestamp = risk_doc.get("timestamp")
        if beh_id:
            await behaviour_col.delete_many({"id": beh_id, "user_id": user_id})
            await behaviour_col.delete_many({"_id": beh_id, "user_id": user_id})
        elif timestamp:
            await behaviour_col.delete_many({"timestamp": timestamp, "user_id": user_id})

    return {
        "message": "Risk record deleted successfully.",
        "record_id": record_id
    }


