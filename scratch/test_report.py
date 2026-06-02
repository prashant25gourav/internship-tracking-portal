import sys
import os

# Add backend directory to sys.path so we can import db_config
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend'))

try:
    from db_config import cursor
    cursor.execute("SELECT * FROM REPORT")
    print(cursor.fetchall())
except Exception as e:
    print(e)
