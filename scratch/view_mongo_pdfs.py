import os
import sys

sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend'))

try:
    from mongo_config import mongo_db
    import gridfs

    if mongo_db is not None:
        fs = gridfs.GridFS(mongo_db)
        print("=== Files Stored in MongoDB GridFS ===")
        files = list(fs.find())
        if not files:
            print("No files found in MongoDB.")
        for f in files:
            print(f"Filename: {f.filename}")
            print(f"File ID: {f._id}")
            print(f"Upload Date: {f.uploadDate}")
            print(f"Size: {f.length / 1024:.2f} KB")
            print("-" * 40)
    else:
        print("MongoDB is not connected.")
except Exception as e:
    print(f"Error: {e}")
