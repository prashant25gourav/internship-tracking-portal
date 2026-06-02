import sys, os
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend'))
try:
    from db_config import cursor
    cursor.execute("SELECT Email FROM STUDENT LIMIT 1;")
    print("Student Email:", cursor.fetchone())
except Exception as e:
    print(e)
