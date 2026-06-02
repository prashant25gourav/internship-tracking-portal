import os
from pymongo import MongoClient
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

print("=========================================")
print("    RECENT ACTIVITY (FROM MONGODB)       ")
print("=========================================")
try:
    client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
    db = client[os.getenv("MONGO_DB_NAME", "internship_portal")]
    logs = db[os.getenv("MONGO_ACTIVITY_COLLECTION", "activity_logs")].find().sort("_id", -1).limit(5)
    
    count = 0
    for log in logs:
        count += 1
        print(f"[{log.get('timestamp', 'N/A')}] User '{log.get('student_id', 'Unknown')}' performed '{log.get('activity_type')}' via {log.get('method')} {log.get('api')}")
        if 'extra_data' in log and log['extra_data']:
            print(f"   -> Details: {log['extra_data']}")
    
    if count == 0:
        print("No recent activity found in MongoDB.")
except Exception as e:
    print("Error connecting to MongoDB:", e)

print("\n=========================================")
print("    RECENT APPLICATIONS (FROM MYSQL)     ")
print("=========================================")
try:
    db = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "root"),
        database=os.getenv("DB_NAME", "internship_portal")
    )
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM APPLICATION ORDER BY App_ID DESC LIMIT 5")
    
    rows = cursor.fetchall()
    if not rows:
        print("No recent applications found in MySQL.")
    for row in rows:
        print(f"[App ID: {row['App_ID']}] Student ID: {row['Student_ID']} applied for Internship ID: {row['Internship_ID']} - Status: {row['Status']} (Date: {row['Apply_Date']})")
except Exception as e:
    print("Error connecting to MySQL:", e)

print("=========================================")
