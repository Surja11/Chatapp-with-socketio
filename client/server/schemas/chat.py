from pydantic import BaseModel

class SendMessage(BaseModel):
  user_id: str
  friend_id : str
  text : str