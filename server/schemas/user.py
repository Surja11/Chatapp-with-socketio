from pydantic import BaseModel

class LoginUser(BaseModel):
  email :str
  password : str

class RegisterUser(BaseModel):
  email : str
  password : str
  username : str