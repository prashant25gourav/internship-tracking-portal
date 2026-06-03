import sys
import os

sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend'))

try:
    from db_config import cursor, db
    
    def add_column_if_not_exists(table, column, datatype):
        cursor.execute(f"SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '{table}' AND table_schema = DATABASE() AND column_name = '{column}'")
        result = cursor.fetchone()
        if type(result) is dict:
            count = result.get('count', 0)
        else:
            count = result[0]
            
        if count == 0:
            cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {datatype}")
            print(f"Added {column} to {table}.")
        else:
            print(f"{column} already exists in {table}.")

    # Check if Password exists in STUDENT, if not add it
    try:
        add_column_if_not_exists('STUDENT', 'Password', 'VARCHAR(255)')
    except Exception as e:
        print("STUDENT Error:", e)
        
    # Check if Email exists in FACULTY, if not add it
    try:
        add_column_if_not_exists('FACULTY', 'Email', 'VARCHAR(100) UNIQUE')
    except Exception as e:
        print("FACULTY Email Error:", e)
        
    # Check if Password exists in FACULTY, if not add it
    try:
        add_column_if_not_exists('FACULTY', 'Password', 'VARCHAR(255)')
    except Exception as e:
        print("FACULTY Password Error:", e)
        
    db.commit()
    print("Schema modifications complete.")
    
except Exception as e:
    print(e)
