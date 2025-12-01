from fastapi import HTTPException,APIRouter, Depends
from auth import *

router = APIRouter()

@router.get('/api/friends/{id}')
def search_friends( id: str, user = Depends(get_current_user)):
  if id.endswith('.com'):
    friend = users_collection.find_one({"email" : id})
    if friend is None: 
      raise HTTPException(status_code = 400, detail= 'No user with the email found')
    friend.pop("password", None)
    friend['_id'] = str(friend['_id'])
    return [friend]
  else:
    friends = list(users_collection.find({'username':id}))
    if len(friends)==0:
      raise HTTPException(status_code = 400, detail = 'No user with the email found' )
    for f in friends:
      f.pop("password", None)
      f["_id"] = str(f["_id"])
    return friends


@router.get('/api/messages/{friend_id}')
def get_previous_messages(friend_id:str, user=Depends(get_current_user)):
  #Query both directions and from oldest to newest
  messages = chat_collection.find({
    "$or": [
      {"user_id":user.id,"friend_id":friend_id},
      {"user_id":friend_id, "friend_id": user.id}, 
    ]
  }).sort("sent_at",1) 

  message_list = list(messages)
  if not message_list: 
    raise HTTPException(status_code=404, detail = "Previous Messages not found")
  return message_list
