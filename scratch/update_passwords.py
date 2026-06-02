import os
import sys

sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend'))

try:
    from db_config import cursor, db
    from werkzeug.security import generate_password_hash

    # The common password for the demo
    demo_password = "password"
    hashed_password = generate_password_hash(demo_password)

    # Update all students
    update_students_query = "UPDATE STUDENT SET Password = %s"
    cursor.execute(update_students_query, (hashed_password,))
    
    # Check if there are any faculty members and update them too
    update_faculty_query = "UPDATE FACULTY SET Password = %s"
    cursor.execute(update_faculty_query, (hashed_password,))

    db.commit()

    print(f"Successfully updated all existing student accounts with the hashed password for: '{demo_password}'")

except Exception as e:
    print(f"Error: {e}")
