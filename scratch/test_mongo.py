import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
mongo_uri = os.getenv('MONGO_URI')
print(f"Testing connection to: {mongo_uri}")

try:
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("SUCCESS: Connected to MongoDB Atlas!")
    
    db = client[os.getenv('MONGO_DB_NAME', 'internship_portal')]
    print(f"Collections available: {db.list_collection_names()}")
except Exception as e:
    print(f"ERROR: Could not connect to MongoDB. Details: {e}")
