import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from app.auth import get_current_user
from app.database import db_manager

router = APIRouter(tags=["Timetable"])

UPLOAD_DIR = "uploads/timetables"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MOCK_PARSED_SCHEDULE = [
    {"day": "Monday", "time": "09:00 AM - 10:30 AM", "subject": "Data Structures & Algorithms"},
    {"day": "Monday", "time": "11:00 AM - 12:30 PM", "subject": "Machine Learning Foundations"},
    {"day": "Tuesday", "time": "10:00 AM - 11:30 AM", "subject": "Database Management Systems"},
    {"day": "Wednesday", "time": "09:00 AM - 11:00 AM", "subject": "Software Engineering Lab"},
    {"day": "Thursday", "time": "01:00 PM - 02:30 PM", "subject": "Operating Systems"},
    {"day": "Friday", "time": "10:00 AM - 12:00 PM", "subject": "AI & Ethics Seminar"},
]

@router.post("/api/timetable-screenshot/upload")
async def upload_timetable(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{user_id}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    file_url = f"/uploads/timetables/{filename}"

    users_col = db_manager.get_collection("Users")
    await users_col.update_one(
        {"id": user_id},
        {"$set": {"has_timetable": True, "timetable_url": file_url, "parsed_schedule": MOCK_PARSED_SCHEDULE}}
    )

    return {"message": "Timetable uploaded successfully", "url": file_url, "parsed_schedule": MOCK_PARSED_SCHEDULE}

@router.get("/api/timetable-screenshot")
async def get_timetable_status(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    users_col = db_manager.get_collection("Users")
    
    user = await users_col.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "has_timetable": user.get("has_timetable", False),
        "timetable_url": user.get("timetable_url", None),
        "parsed_schedule": user.get("parsed_schedule", [])
    }
