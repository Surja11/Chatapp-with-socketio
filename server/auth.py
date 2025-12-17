import os,jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, Depends
from database.config import users_collection


load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM")
password_context = CryptContext(schemes = ["pbkdf2_sha256"], deprecated = "auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "/login")


def hash_password(password: str):
  return password_context.hash(password)

def verify_password(password, hashed):
  return password_context.verify(password, hashed)

def create_access_token(data, expires_delta: timedelta = timedelta(hours = 1)):
  data_to_encode = data.copy()
  expire = datetime.now() + expires_delta
  data_to_encode.update({"exp":expire,"type": "access"})
  return jwt.encode(data_to_encode, SECRET_KEY, algorithm = ALGORITHM)

def create_refresh_token(data: dict):
    expire = datetime.now() + timedelta(days=1)
    to_encode = {**data, "exp": expire, "type": "refresh"}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token, expected_type):
   try:
      payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
      if payload.get("type") !=expected_type:
         raise HTTPException(status_code = 400, detail ="Invalid token")
      return payload
   except jwt.ExpiredSignatureError:
      raise HTTPException(status_code=401, detail="Token expired")
   except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
   

def get_current_user(token = Depends(oauth2_scheme)):
   payload = verify_token(token, "access")
   email = payload.get("email")
   if not email:
      raise HTTPException(status_code = 401, detail = "Not authenticated")
   
   user= users_collection.find_one({"email": email})
   if not user:
      raise HTTPException(status_code = 401, detail = "User not found")
   return user