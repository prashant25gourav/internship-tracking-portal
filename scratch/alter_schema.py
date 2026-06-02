import sys
import os

sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend'))

try:
    from db_config import cursor, db
    
    # Check if Password exists in STUDENT, if not add it
    try:
        cursor.execute("ALTER TABLE STUDENT ADD COLUMN Password VARCHAR(255);")
        print("Added Password to STUDENT.")
    except Exception as e:
        print("STUDENT:", e)
        
    # Check if Email exists in FACULTY, if not add it
    try:
        cursor.execute("ALTER TABLE FACULTY ADD COLUMN Email VARCHAR(100) UNIQUE;")
        print("Added Email to FACULTY.")
    except Exception as e:
        print("FACULTY Email:", e)
        
    # Check if Password exists in FACULTY, if not add it
    try:
        cursor.execute("ALTER TABLE FACULTY ADD COLUMN Password VARCHAR(255);")
        print("Added Password to FACULTY.")
    except Exception as e:
        print("FACULTY Password:", e)
        
    db.commit()
    print("Schema modifications complete.")
    
except Exception as e:
    print(e)
