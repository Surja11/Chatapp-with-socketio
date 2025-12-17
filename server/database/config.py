from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(
    os.getenv("MONGO_URI")
)

db = client.chatapp_db
chat_collection = db["chat_collection"]
users_collection = db["users_collection"]