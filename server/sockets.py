import socketio
import datetime
from bson import ObjectId
from database.config import *

sio_server = socketio.AsyncServer(
  async_mode = 'asgi',
  cors_allowed_origins = "*"
)



sio_app = socketio.ASGIApp(
  socketio_server = sio_server,
  socketio_path = '/sockets'
)


online_users = {}

def serialize_msg(msg):
  msg["_id"] = str(msg["_id"])
  return msg

@sio_server.event
async def connect(sid, enviorn, auth):
  print('connected')

@sio_server.event
async def register(sid, data):
  user_id = data["user_id"]
  online_users[user_id] = sid
  print(f"User {user_id} registerd with sid {sid}")

  undelivered = list(chat_collection.find({
    "friend_id": user_id,
    "delivered" : False
  }))

  for msg in undelivered:
    await sio_server.emit("receive_message", serialize_msg(msg), to= sid)

    chat_collection.update_one(
      {"_id": msg["_id"]},
      {"$set": {"delivered": True}}
    )
    print(f"Delivered saved msg to {user_id}")

  print(f"All undelivered messages sent to {user_id}")

  


@sio_server.event
async def send_message(sid, data):
  
  doc = {
    "user_id": data["user_id"],
    "friend_id":data["friend_id"],
    "text": data["text"],
    "sent_at": datetime.datetime.now().isoformat(),
    "delivered":False
  }
  inserted = chat_collection.insert_one(doc)
  doc["_id"] = str(inserted.inserted_id)

  receiver = data["friend_id"]
  if receiver in online_users:
    friend_sid = online_users[receiver]
    await sio_server.emit("receive_message", doc, to=friend_sid)
    chat_collection.update_one(
            {"_id": ObjectId(doc["_id"])},
            {"$set": {"delivered": True}}
        )
    print(f"Delivered live message to {receiver}")


  else:
    print(f"User {receiver} is offline, message saved.")

  await sio_server.emit("message_sent", doc, to=sid)


@sio_server.event
async def disconnect(sid):

  to_remove = None
  for user_id, socket_id in online_users.items():
    if socket_id == sid:
      to_remove = user_id
      break
    
  if to_remove:
      del online_users[to_remove]
      print(f"user {to_remove} disconnected")