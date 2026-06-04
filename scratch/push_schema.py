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
        
        with open('database/schema.sql', 'r') as f:
            sql_script = f.read()
            
        # Extract statements
        statements = []
        parts = sql_script.split('DELIMITER $$')
        standard_sql = parts[0]
        
        if len(parts) > 1:
            trigger_sql = parts[1].split('DELIMITER ;')[0].replace('END$$', 'END')
        else:
            trigger_sql = ""
            
        for stmt in standard_sql.split(';'):
            s = stmt.strip()
            if s and not s.upper().startswith('CREATE DATABASE') and not s.upper().startswith('USE '):
                statements.append(s)
                
        if trigger_sql:
            statements.append(trigger_sql.strip())
            
        for stmt in statements:
            if stmt:
                print(f"Executing: {stmt[:50]}...")
                cursor.execute(stmt)
                
        db.commit()
        print("Schema applied successfully to Railway DB!")
    except Exception as e:
        print("Error:", e)
        if 'db' in locals():
            db.rollback()

if __name__ == "__main__":
    execute_sql()
