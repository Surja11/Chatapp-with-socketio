from pydantic import BaseModel
from datetime import datetime

class Chat(BaseModel):
  user_id : str
  friend_id : str
  text : str
  sent_at : datetime = datetime.now()

  