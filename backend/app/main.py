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
