from fastapi import FastAPI, Depends
from routers import accounts, chat
from fastapi.middleware.cors import CORSMiddleware
from auth import *
import socketio
from sockets import sio_server

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"],     
)

@app.get('/')
def home():
    return {'message': 'hello'}

@app.get("/api/me")
def me(current_user=Depends(get_current_user)):
    current_user['_id'] = str(current_user['_id'])
    current_user.pop('password', None)
    return current_user

app.include_router(accounts.router)
app.include_router(chat.router)

#Wrapping the complete FastAPI app with Socket.IO
sio_app = socketio.ASGIApp(
    socketio_server=sio_server,
    other_asgi_app=app
)