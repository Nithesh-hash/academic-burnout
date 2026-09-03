from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import db_manager
from app.routers import auth, behaviour, risk

app = FastAPI(
    title="Adaptive AI Academic Behaviour Risk Monitoring System API",
    description="Privacy-friendly AI system monitoring student academic and lifestyle behaviour patterns.",
    version="1.0.0"
)

# CORS setup for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local dev frontend at http://localhost:5173 or any port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(behaviour.router)
app.include_router(risk.router)

@app.on_event("startup")
async def startup_db_client():
    await db_manager.connect()
    # Ensure default student1 demo account is initialized
    try:
        import uuid
        from datetime import datetime
        from app.auth import hash_password
        users_col = db_manager.get_collection("Users")
        profiles_col = db_manager.get_collection("StudentProfiles")
        student1 = await users_col.find_one({"username": "student1"})
        demo_pwd_hash = hash_password("demo1234")
        if not student1:
            user_id = str(uuid.uuid4())
            created_at = datetime.utcnow().isoformat()
            await users_col.insert_one({
                "_id": user_id,
                "id": user_id,
                "username": "student1",
                "password": demo_pwd_hash,
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
        else:
            await users_col.update_one({"_id": student1["_id"]}, {"$set": {"password": demo_pwd_hash}})
    except Exception as e:
        print(f"Demo user auto-init notice: {e}")

@app.get("/")
@app.get("/api/health")
async def root():
    return {
        "status": "healthy",
        "system": "Adaptive AI-Based Academic Behaviour Risk Monitoring System",
        "version": "1.0.0",
        "database_mode": "MongoDB" if db_manager.is_mongo else "Local Collection Engine"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
