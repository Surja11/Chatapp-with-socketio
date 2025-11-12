from fastapi import HTTPExceptions,APIView, Depends
from auth import *
router = APIView()

@router.get('/api/friends/{id}')
def search_friends( id: str, user = Depends(get_current_user)):
  if id.endswith('.com'):
    friend = users_collection.find_one({"email" : id})
    if friend is None: 
      raise HTTPException(status_code = 400, detail= 'No user with the email found')
    friend.pop("password", None)
    friend['_id'] = str(friend['_id'])
    return friend
  else:
    friends = list(users_collection.find({'username':id}))
    if friends is None:
      raise HTTPException(status = 400, detail = 'No user with the email found' )
    for f in friends:
      f.pop("password", None)
      f["_id"] = str(f["_id"])
    return friends
