from pydantic import BaseModel, EmailStr

class User(BaseModel):
  username : str
  password : str
  profile : str|None= None
  email : EmailStr
