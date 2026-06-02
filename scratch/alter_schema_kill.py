import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

try:
    db = mysql.connector.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', 'root'),
        database=os.getenv('DB_NAME', 'internship_portal')
    )
    cursor = db.cursor()
    
    # Kill all other processes to remove locks
    cursor.execute("SHOW PROCESSLIST")
    processes = cursor.fetchall()
    connection_id = db.connection_id
    
    for row in processes:
        pid = row[0]
        if pid != connection_id:
            try:
                cursor.execute(f"KILL {pid}")
                print(f"Killed process {pid}")
            except Exception as e:
                pass
                
    # Alter schema
    try:
        cursor.execute("ALTER TABLE STUDENT ADD COLUMN Password VARCHAR(255);")
        print("Added Password to STUDENT.")
    except Exception as e:
        print("STUDENT:", e)
        
    try:
        cursor.execute("ALTER TABLE FACULTY ADD COLUMN Email VARCHAR(100) UNIQUE;")
        print("Added Email to FACULTY.")
    except Exception as e:
        print("FACULTY Email:", e)
        
    try:
        cursor.execute("ALTER TABLE FACULTY ADD COLUMN Password VARCHAR(255);")
        print("Added Password to FACULTY.")
    except Exception as e:
        print("FACULTY Password:", e)
        
    db.commit()
    cursor.close()
    db.close()
except Exception as e:
    print(e)
