from fastapi import HTTPException, APIRouter, Depends
from auth import *
from database.config import chat_collection, users_collection
from bson import ObjectId

router = APIRouter()

@router.get('/api/friends/{id}')
def search_friends(id: str, user=Depends(get_current_user)):
    if id.endswith('.com'):
        friend = users_collection.find_one({"email": id})
        if friend is None: 
            raise HTTPException(status_code=400, detail='No user with the email found')
        friend.pop("password", None)
        friend['_id'] = str(friend['_id'])
        return [friend]
    else:
        friends = list(users_collection.find({'username': id}))
        if len(friends) == 0:
            raise HTTPException(status_code=400, detail='No user with the email found')
        for f in friends:
            f.pop("password", None)
            f["_id"] = str(f["_id"])
        return friends


@router.get('/api/chat/history')
def get_chat_history(friend_id: str, current_user=Depends(get_current_user)):
    user_email = current_user['email']
    print("user_email:", repr(user_email))  
    print("friend_id:", repr(friend_id))

    # Query both directions and sort from oldest to newest
    messages = list(chat_collection.find({
        "$or": [
            {"user_id": user_email, "friend_id": friend_id},
            {"user_id": friend_id, "friend_id": user_email}, 
        ]
    }).sort("sent_at", 1))

    for msg in messages:
        msg["_id"] = str(msg["_id"])
    
    return {"messages": messages}
from bson import ObjectId

def serialize_user(user):
    if not user:
        return None
    return {
        **{k: str(v) if isinstance(v, ObjectId) else v for k, v in user.items()}
    }

@router.get('/api/chat/recent')
def get_recent_chats(current_user=Depends(get_current_user)):

    current_email = current_user["email"]

    pipeline = [
        {
            "$match": {
                "$or": [
                    {"user_id": current_email},
                    {"friend_id": current_email}
                ]
            }
        },
        {
            "$project": {
                "other_user": {
                    "$cond": [
                        {"$eq": ["$user_id", current_email]},
                        "$friend_id",
                        "$user_id"
                    ]
                },
                "created_at": 1
            }
        },
        {
            "$group": {
                "_id": "$other_user",
                "last_message_time": {"$max": "$created_at"}
            }
        },
        {
            "$sort": {"last_message_time": -1}
        }
    ]

    chats = list(chat_collection.aggregate(pipeline))

    user_emails = [c["_id"] for c in chats]

    users = list(users_collection.find(
        {"email": {"$in": user_emails}},
        {"password": 0}
    ))

    # convert all ObjectIds in users to strings
    user_map = {u["email"]: serialize_user(u) for u in users}

    result = []
    for c in chats:
        email = c["_id"]
        result.append({
            "user": user_map.get(email),
            "last_message_time": c["last_message_time"]
        })
    print(result)
    return result
