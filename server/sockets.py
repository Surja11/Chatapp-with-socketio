import socketio
import datetime
from bson import ObjectId
from database.config import *

sio_server = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*"
)

online_users = {}

def serialize_msg(msg):
    msg["_id"] = str(msg["_id"])
    return msg

@sio_server.event
async def connect(sid, environ, auth):
    print(f'Client connected: {sid}')

@sio_server.event
async def register(sid, data):
    print(f"Register event received with data: {data}")
    user_id = data.get("user_id")
    if not user_id:
        print(f"Registration failed: no user_id provided")
        return
    
    online_users[user_id] = sid
    print(f"User {user_id} registered with sid {sid}")
    print(f"Currently online users: {list(online_users.keys())}")
    
    # Send undelivered messages
    undelivered = list(chat_collection.find({
        "friend_id": user_id,
        "delivered": False
    }))
    
    print(f"Found {len(undelivered)} undelivered messages for {user_id}")
    
    for msg in undelivered:
        await sio_server.emit("receive_message", serialize_msg(msg), to=sid)
        chat_collection.update_one(
            {"_id": msg["_id"]},
            {"$set": {"delivered": True}}
        )
        print(f"Delivered saved msg to {user_id}")
    
    print(f"All undelivered messages sent to {user_id}")

@sio_server.event
async def send_message(sid, data):
    print(f"send_message event received!")
    print(f"Sender SID: {sid}")
    print(f"Data received: {data}")
    
    try:
        doc = {
            "user_id": data["user_id"],
            "friend_id": data["friend_id"],
            "text": data["text"],
            "sent_at": datetime.datetime.now().isoformat(),
            "delivered": False
        }
        
        print(f"Attempting to save to database: {doc}")
        inserted = chat_collection.insert_one(doc)
        doc["_id"] = str(inserted.inserted_id)
        print(f"Message saved to database with ID: {doc['_id']}")
        
        receiver = data["friend_id"]
        
        # Try to deliver to online user
        if receiver in online_users:
            friend_sid = online_users[receiver]
            print(f"Receiver {receiver} is online with sid {friend_sid}")
            await sio_server.emit("receive_message", doc, to=friend_sid)
            chat_collection.update_one(
                {"_id": ObjectId(doc["_id"])},
                {"$set": {"delivered": True}}
            )
            print(f"Delivered live message to {receiver}")
        else:
            print(f"User {receiver} is offline, message saved for later.")
            print(f"Online users: {list(online_users.keys())}")
        
        # Confirm to sender
        await sio_server.emit("message_sent", doc, to=sid)
        print(f"Sent confirmation to sender {sid}")
        
    except Exception as e:
        print(f"ERROR in send_message: {e}")
        import traceback
        traceback.print_exc()

@sio_server.event
async def disconnect(sid):
    print(f"Client disconnecting: {sid}")
    to_remove = None
    for user_id, socket_id in online_users.items():
        if socket_id == sid:
            to_remove = user_id
            break
    
    if to_remove:
        del online_users[to_remove]
        print(f"User {to_remove} disconnected")
        print(f"Currently online users: {list(online_users.keys())}")