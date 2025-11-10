from fastapi import FastAPI
from routers import accounts
from sockets import sio_app

app = FastAPI()

app.mount('/socket',app = sio_app)

@app.get('/')
def home():
  return {'message': 'helo'}

app.include_router(accounts.router)
