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
    # Initialize default user account: Nithesh Kumar T / Nithesh@06
    try:
        import uuid
        from datetime import datetime
        from app.auth import hash_password
        users_col = db_manager.get_collection("Users")
        profiles_col = db_manager.get_collection("StudentProfiles")
        
        nithesh_user = await users_col.find_one({"username": {"$regex": "^nithesh.*", "$options": "i"}})
        nithesh_hash = hash_password("Nithesh@06")

        if not nithesh_user:
            user_id = str(uuid.uuid4())
            created_at = datetime.utcnow().isoformat()
            await users_col.insert_one({
                "_id": user_id,
                "id": user_id,
                "username": "Nithesh Kumar T",
                "password": nithesh_hash,
                "name": "Nithesh Kumar T",
                "department": "M.Tech Integrated Software Engineering",
                "year": "1st Year",
                "created_at": created_at
            })
            await profiles_col.insert_one({
                "_id": str(uuid.uuid4()),
                "user_id": user_id,
                "username": "Nithesh Kumar T",
                "name": "Nithesh Kumar T",
                "department": "M.Tech Integrated Software Engineering",
                "year": "1st Year",
                "baseline_ready": False,
                "created_at": created_at
            })
        else:
            await users_col.update_one(
                {"_id": nithesh_user["_id"]},
                {"$set": {"password": nithesh_hash, "name": "Nithesh Kumar T", "username": "Nithesh Kumar T"}}
            )

        # Also initialize student1 demo fallback
        student1 = await users_col.find_one({"username": "student1"})
        demo_pwd_hash = hash_password("demo1234")
        if not student1:
            u_id = str(uuid.uuid4())
            c_at = datetime.utcnow().isoformat()
            await users_col.insert_one({
                "_id": u_id,
                "id": u_id,
                "username": "student1",
                "password": demo_pwd_hash,
                "name": "Student Demo",
                "department": "M.Tech Integrated Software Engineering",
                "year": "1st Year",
                "created_at": c_at
            })
    except Exception as e:
        print(f"User auto-init notice: {e}")


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "system": "Adaptive AI-Based Academic Behaviour Risk Monitoring System",
        "version": "1.0.0",
        "database_mode": "MongoDB" if db_manager.is_mongo else "Local Collection Engine"
    }

# Static file serving & SPA fallback
import os
import sys
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

def get_dist_dir():
    # 1. PyInstaller bundled directory
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        bundled_dist = os.path.join(sys._MEIPASS, "frontend_dist")
        if os.path.exists(bundled_dist):
            return bundled_dist
    # 2. Next to executable
    if getattr(sys, "frozen", False):
        exe_dist = os.path.join(os.path.dirname(sys.executable), "frontend_dist")
        if os.path.exists(exe_dist):
            return exe_dist
    # 3. Development relative directory
    dev_dist = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "frontend", "dist")
    if os.path.exists(dev_dist):
        return dev_dist
    return None

dist_dir = get_dist_dir()
if dist_dir and os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa_frontend(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        candidate = os.path.join(dist_dir, full_path)
        if full_path and os.path.isfile(candidate):
            return FileResponse(candidate)
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Frontend index.html not found"}
else:
    @app.get("/")
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

