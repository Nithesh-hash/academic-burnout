from datetime import datetime
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.auth import get_current_user
from app.database import db_manager
from app.models import ExtracurricularActivityCreate, ExtracurricularActivity

router = APIRouter(tags=["Extracurricular"])

@router.post("/api/extracurricular", response_model=ExtracurricularActivity)
async def create_extracurricular(
    activity_in: ExtracurricularActivityCreate,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    activities_col = db_manager.get_collection("ExtracurricularActivities")
    
    activity_id = str(uuid.uuid4())
    new_activity = {
        "id": activity_id,
        "user_id": user_id,
        "name": activity_in.name,
        "day_of_week": activity_in.day_of_week,
        "duration_hours": activity_in.duration_hours,
        "type": activity_in.type,
        "created_at": datetime.utcnow().isoformat()
    }
    
    # ensure it uses _id for the insert internally but returns correctly
    insert_doc = dict(new_activity)
    insert_doc["_id"] = activity_id
    
    await activities_col.insert_one(insert_doc)
    
    return new_activity

@router.get("/api/extracurricular", response_model=List[ExtracurricularActivity])
async def get_extracurriculars(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    activities_col = db_manager.get_collection("ExtracurricularActivities")
    
    cursor = activities_col.find({"user_id": user_id})
    activities = await cursor.to_list(length=100)
    
    return activities

@router.delete("/api/extracurricular/{activity_id}")
async def delete_extracurricular(activity_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    activities_col = db_manager.get_collection("ExtracurricularActivities")
    
    await activities_col.delete_many({"id": activity_id, "user_id": user_id})
    
    return {"message": "Extracurricular activity deleted"}
