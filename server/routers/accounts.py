from database.models.user import *
from database.config import users_collection
from fastapi import APIRouter, FastAPI,HTTPException
from uuid import uuid4
from datetime import datetime
from auth import *
from pydantic import BaseModel
from fastapi import Request


router = APIRouter()

class UserRegister(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/api/register")
def register(user: UserRegister):
    if users_collection.find_one({"email": user.email}):
        return HTTPException(status_code = 400, detail = "User already exists")
    hashed_password =  hash_password(user.password)
    users_collection.insert_one({
        "email": user.email,
        "username": user.username, 
        "password": hashed_password
    })
    return {"message": "User registered"}


@router.post('/api/login')
def login(user:UserLogin, request: Request):
        
        logged_user = users_collection.find_one({'email': user.email})
        print("logged_user")
        if not logged_user:
            raise HTTPException(status_code = 400, detail = "Invalid credentials")
        
        if not verify_password(user.password, logged_user["password"]):
            raise HTTPException(status_code = 400, detail = "Invalid credentials")
            
        access_token = create_access_token({'email': logged_user["email"], "user_id": str(logged_user["_id"])})
        print(access_token)
        refresh_token = create_refresh_token({'email': logged_user["email"], "user_id": str(logged_user["_id"])})
        print(refresh_token)
        return {
                "email": logged_user["email"],
                "access_token": access_token,
                "refresh_token": refresh_token
            }
        


@router.post("/api/refresh")
def refresh_token(refresh_token: str):
    payload = verify_token(refresh_token, "refresh")
    data = {"email": payload.get("email"), "user_id": payload.get("user_id")}
    new_access_token = create_access_token(data)
    return {"access_token": new_access_token, "token_type": "bearer"}

