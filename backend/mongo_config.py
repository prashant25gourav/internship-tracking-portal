from pymongo import MongoClient
import gridfs
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'internship_portal')
MONGO_ACTIVITY_COLLECTION = os.getenv('MONGO_ACTIVITY_COLLECTION', 'activity_logs')

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    mongo_db = client[MONGO_DB_NAME]
    activity_collection = mongo_db[MONGO_ACTIVITY_COLLECTION]
    fs = gridfs.GridFS(mongo_db)
    try:
        activity_collection.create_index([('timestamp', -1)])
    except Exception:
        pass
except Exception:
    client = None
    mongo_db = None
    activity_collection = None
    fs = None

def save_file_to_mongo(file, filename):
    if fs is None:
        raise Exception("MongoDB is not connected.")
    file_id = fs.put(file, filename=filename)
    return str(file_id)

def get_file_from_mongo(file_id):
    if fs is None:
        raise Exception("MongoDB is not connected.")
    from bson.objectid import ObjectId
    return fs.get(ObjectId(file_id))


def log_activity(
    student_id,
    activity_type,
    description,
    module,
    api,
    method,
    extra_data=None
):
    if activity_collection is None:
        return None

    document = {
        "student": {"id": student_id, "role": "student"},
        "activity": {"type": activity_type, "description": description},
        "system": {"module": module, "api": api, "method": method},
        "metadata": extra_data or {},
        "timestamp": datetime.utcnow()
    }

    try:
        return activity_collection.insert_one(document)
    except Exception:
        return None


def get_recent_activities(limit=10):
    """Return the most recent activity documents (newest first)."""
    if activity_collection is None:
        return []
    try:
        docs = list(activity_collection.find().sort("timestamp", -1).limit(int(limit)))
        for d in docs:
            d['id'] = str(d.pop('_id', ''))
            if isinstance(d.get('timestamp'), datetime):
                d['timestamp'] = d['timestamp'].isoformat() + 'Z'
        return docs
    except Exception:
        return []


def get_activity_count():
    """Return total number of activity log documents."""
    if activity_collection is None:
        return 0
    try:
        return int(activity_collection.count_documents({}))
    except Exception:
        return 0

