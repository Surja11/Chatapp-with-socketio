from fastapi import APIRouter
from schemas.user import *
from database.config import *
from auth import *

router = APIRouter()

@router.post('/api/register')
def register(request:RegisterUser):
  if users_collection.find_one({"email": request.email}):
    return HTTPException(status_code = 400, detail ="User with the email already exists")
  email = request.email
  username = request.username
  password = request.password
  hashed_password = hash_password(password)
  user = users_collection.insert_one(
    {"email": email, "username": username, "password":hashed_password }
  )
  return "User registered"

@router.post('/api/login')
def login(request: LoginUser):
  email = request.email
  password = request.password
  if email: 
    user = users_collection.find_one({'email': email})
    if user: 
      if verify_password(password, user['password']):
        access_token = create_access_token(data={'email': email, 'user_id': str(user['_id'])})
        refresh_token = create_access_token(data={'email': email, 'user_id': str(user['_id'])})
        return {"email": user['email'], "access": access_token, "refresh": refresh_token}
  raise HTTPException(status_code =400, detail = "Invalid credentials") 


