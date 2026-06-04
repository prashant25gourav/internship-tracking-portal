import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

load_dotenv()
mongo_uri = os.getenv('MONGO_URI')

try:
    client = MongoClient(mongo_uri)
    db = client[os.getenv('MONGO_DB_NAME', 'internship_portal')]
    collection = db['activity_logs']
    
    # Insert a mock log
    test_log = {
        "student": {"id": "system_test", "role": "admin"},
        "activity": {"type": "system_initialization", "description": "Successfully migrated to MongoDB Atlas!"},
        "system": {"module": "database", "api": "/test-migration", "method": "TEST"},
        "metadata": {"status": "success"},
        "timestamp": datetime.utcnow()
    }
    
    result = collection.insert_one(test_log)
    print(f"Successfully inserted test log with ID: {result.inserted_id}")
    
except Exception as e:
    print(f"Error: {e}")
