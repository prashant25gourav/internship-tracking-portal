import sys
import os

sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend'))

try:
    from db_config import cursor
    cursor.execute("DESCRIBE REPORT;")
    for row in cursor.fetchall():
        print(row)
except Exception as e:
    print(e)
