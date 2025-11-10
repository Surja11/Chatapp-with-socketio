from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
import os, jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends


load_dotenv()


SECRET_KEY = os.getenv('JWT_SECRET')
ALGORITHM = os.getenv("JWT_ALGORITHM"
                      )
password_context = CryptContext(schemes = ["pbkdf2_sha256"], deprecated = "auto")

def hash_password(password : str):
  return password_context.hash(password)


def verify_password(password: str,hashed):
  return password_context.verify(password,hashed)


def create_access_token(data, expiry_time :timedelta= timedelta(hours = 1)):
  data_to_encode = data.copy()
  expires_in = datetime.now()+expiry_time
  data_to_encode.update({"exp":expires_in, "type":"access"})
  return jwt.encode(data_to_encode, SECRET_KEY, ALGORITHM)


def create_referesh_token(data, expiry_time:timedelta = timedelta(days = 1)):
  data_to_encode = data.copy()
  expires_in = datetime.now()+expiry_time
  data_to_encode.update({"exp": expires_in, "type": "refresh"})
  return jwt.encode(data_to_encode, SECRET_KEY, ALGORITHM)


def verify_token(token, expected_type):
  try:
    payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
    if payload["type"] != expected_type:
      raise HTTPException(status_code = 400, detail = "Invalid token")
    return payload
  except jwt.ExpiredSignatureError: 
    raise HTTPException(status_code=401, detail="Token expired")
  except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
  

   

