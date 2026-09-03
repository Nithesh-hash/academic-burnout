import asyncio
import uuid
from datetime import datetime
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import db_manager
from app.auth import hash_password, verify_password

async def main():
    await db_manager.connect()
    users_col = db_manager.get_collection("Users")
    profiles_col = db_manager.get_collection("StudentProfiles")

    # Update or insert student1
    student1 = await users_col.find_one({"username": "student1"})
    demo_hash = hash_password("demo1234")
    
    if student1:
        await users_col.update_one(
            {"_id": student1["_id"]},
            {"$set": {"password": demo_hash}}
        )
        print("Updated student1 password to hash of demo1234")
    else:
        user_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        await users_col.insert_one({
            "_id": user_id,
            "id": user_id,
            "username": "student1",
            "password": demo_hash,
            "name": "Student Demo",
            "department": "M.Tech Integrated Software Engineering",
            "year": "1st Year",
            "created_at": created_at
        })
        await profiles_col.insert_one({
            "_id": str(uuid.uuid4()),
            "user_id": user_id,
            "username": "student1",
            "name": "Student Demo",
            "department": "M.Tech Integrated Software Engineering",
            "year": "1st Year",
            "baseline_ready": False,
            "created_at": created_at
        })
        print("Created student1 with password demo1234")

    # Verify student1 can verify demo1234
    student1_check = await users_col.find_one({"username": "student1"})
    print("student1 check demo1234:", verify_password("demo1234", student1_check.get("password", "")))

if __name__ == "__main__":
    asyncio.run(main())
