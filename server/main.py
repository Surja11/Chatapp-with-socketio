from fastapi import FastAPI
from routers import accounts,chat
from sockets import sio_app
from fastapi.middleware.cors import CORSMiddleware
from auth import *

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",  
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"],     
)



app.mount('/socket',app = sio_app)

@app.get('/')
def home():
  return {'message': 'helo'}

@app.get("/api/me")
def me(current_user = Depends(get_current_user)):
  current_user['_id']= str(current_user['_id'])
  current_user.pop('password')
  return current_user


app.include_router(accounts.router)
app.include_router(chat.router)
