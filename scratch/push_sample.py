import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()

def execute_sql():
    print(f"Connecting to {os.getenv('DB_HOST')}...")
    try:
        db = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME'),
            port=int(os.getenv('DB_PORT', 3306))
        )
        cursor = db.cursor()
        print(f"Connected successfully to database: {os.getenv('DB_NAME')}")
        
        with open('database/sample_data.sql', 'r') as f:
            sql_script = f.read()
            
        for stmt in sql_script.split(';'):
            s = stmt.strip()
            if s and not s.upper().startswith('USE '):
                print(f"Executing: {s[:50]}...")
                cursor.execute(s)
                
        db.commit()
        print("Sample data applied successfully to Railway DB!")
    except Exception as e:
        print("Error:", e)
        if 'db' in locals():
            db.rollback()

if __name__ == "__main__":
    execute_sql()
