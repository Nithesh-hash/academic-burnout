import os

SECRET_KEY = os.getenv("SECRET_KEY", "academic_behaviour_risk_jwt_secret_key_2026_antigravity")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "academic_risk_db")
