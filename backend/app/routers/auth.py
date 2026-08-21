import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.models import UserRegister, UserLogin, Token, UserResponse
from app.auth import hash_password, verify_password, create_access_token, get_current_user
from app.database import db_manager

router = APIRouter(tags=["Authentication"])

@router.post("/register", response_model=Token)
@router.post("/api/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    users_col = db_manager.get_collection("Users")
    profiles_col = db_manager.get_collection("StudentProfiles")
    
    clean_username = user_data.username.strip().lower()
    if not clean_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username cannot be empty."
        )

    # Check if username already exists
    existing = await users_col.find_one({"username": clean_username})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken. Please choose another username."
        )
    
    user_id = str(uuid.uuid4())
    hashed_pwd = hash_password(user_data.password)
    created_at = datetime.utcnow().isoformat()
    display_name = user_data.name.strip() if user_data.name and user_data.name.strip() else clean_username
    
    # User document
    user_doc = {
        "_id": user_id,
        "id": user_id,
        "username": clean_username,
        "password": hashed_pwd,
        "name": display_name,
        "department": user_data.department,
        "year": user_data.year,
        "created_at": created_at
    }
    await users_col.insert_one(user_doc)
    
    # StudentProfile document
    profile_doc = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "username": clean_username,
        "name": display_name,
        "department": user_data.department,
        "year": user_data.year,
        "baseline_ready": False,
        "created_at": created_at
    }
    await profiles_col.insert_one(profile_doc)
    
    # JWT token
    token_payload = {
        "sub": user_id,
        "username": clean_username,
        "name": display_name,
        "department": user_data.department,
        "year": user_data.year
    }
    access_token = create_access_token(token_payload)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "username": clean_username,
            "name": display_name,
            "department": user_data.department,
            "year": user_data.year
        }
    }

@router.post("/login", response_model=Token)
@router.post("/api/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    users_col = db_manager.get_collection("Users")
    clean_username = credentials.username.strip().lower()
    
    user = await users_col.find_one({"username": clean_username})
    
    # Also support searching by legacy email field if username match fails
    if not user:
        user = await users_col.find_one({"email": clean_username})

    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token_payload = {
        "sub": user["id"],
        "username": user.get("username", clean_username),
        "name": user.get("name", clean_username),
        "department": user.get("department", "M.Tech Integrated Software Engineering"),
        "year": user.get("year", "1st Year")
    }
    access_token = create_access_token(token_payload)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user.get("username", clean_username),
            "name": user.get("name", clean_username),
            "department": user.get("department", "M.Tech Integrated Software Engineering"),
            "year": user.get("year", "1st Year")
        }
    }

@router.get("/me", response_model=UserResponse)
@router.get("/api/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
