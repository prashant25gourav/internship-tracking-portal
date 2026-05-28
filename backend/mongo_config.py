from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://localhost:27017/")

mongo_db = client["internship_portal"]

activity_collection = mongo_db["activity_logs"]


def log_activity(
    student_id,
    activity_type,
    description,
    module,
    api,
    method,
    extra_data=None
):

    document = {

        "student": {
            "id": student_id,
            "role": "student"
        },

        "activity": {
            "type": activity_type,
            "description": description
        },

        "system": {
            "module": module,
            "api": api,
            "method": method
        },

        "metadata": extra_data or {},

        "timestamp": datetime.utcnow()
    }

    result = activity_collection.insert_one(document)

   