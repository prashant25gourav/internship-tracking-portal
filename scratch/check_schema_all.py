import sys
import os

sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend'))

try:
    from db_config import cursor
    cursor.execute("SHOW TABLES;")
    tables = cursor.fetchall()
    print("Tables:", tables)
    for table in tables:
        tname = table.get('Tables_in_internship_portal', list(table.values())[0])
        print(f"\n--- {tname} ---")
        cursor.execute(f"DESCRIBE {tname};")
        for col in cursor.fetchall():
            print(col)
except Exception as e:
    print(e)
