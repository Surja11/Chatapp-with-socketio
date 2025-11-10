from fastapi import FastAPI

from sockets import sio_app

app = FastAPI()
app.mount('/',app = sio_app)

@app.get('/')
def home():
  return {'message': 'helo'}

