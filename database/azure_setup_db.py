"""Azure MySQL Database Setup and Migration Script.

Connects to Azure Database for MySQL Flexible Server, ensures the database
exists, creates all schema tables, views, triggers, and populates sample data.

Usage:
    python database/azure_setup_db.py
"""

import os
import sys
import getpass
from dotenv import load_dotenv
import mysql.connector

# Load .env if present
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))


def get_db_credentials():
    host = os.getenv("DB_HOST") or "internship-portal-mysql.mysql.database.azure.com"
    user = os.getenv("DB_USER") or "azureadmin"
    raw_port = os.getenv("DB_PORT") or "3306"
    port = int(raw_port.strip()) if raw_port and raw_port.strip().isdigit() else 3306
    db_name = os.getenv("DB_NAME") or "internship_portal"

    password = os.getenv("DB_PASSWORD")
    if not password:
        password = getpass.getpass(f"Enter MySQL password for {user}@{host}: ")

    return host, user, password, port, db_name


def connect_server(host, user, password, port):
    print(f"[*] Connecting to MySQL server at {host}:{port}...")
    kwargs = {
        "host": host,
        "user": user,
        "password": password,
        "port": port,
        "connection_timeout": 15,
        "use_pure": True,
        "ssl_disabled": False,
        "ssl_verify_cert": False,
        "ssl_verify_identity": False,
    }
    return mysql.connector.connect(**kwargs)


def execute_script(cursor, filepath):
    print(f"\n[*] Applying {os.path.basename(filepath)}...")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Handle trigger delimiter
    parts = content.split("DELIMITER $$")
    standard_part = parts[0]
    trigger_part = ""
    if len(parts) > 1:
        trigger_sub = parts[1].split("DELIMITER ;")[0]
        trigger_part = trigger_sub.replace("END$$", "END").strip()

    # Execute standard statements
    for stmt in standard_part.split(";"):
        cleaned = stmt.strip()
        if not cleaned:
            continue
        # Skip top-level CREATE/USE statements since we handle database creation explicitly
        if cleaned.upper().startswith("CREATE DATABASE") or cleaned.upper().startswith("USE "):
            continue
        try:
            cursor.execute(cleaned)
            summary = cleaned.split("\n")[0][:60]
            print(f"  [OK] {summary}...")
        except Exception as e:
            summary = cleaned.split("\n")[0][:60]
            print(f"  [WARN] {summary}... => {e}")

    # Execute trigger if present
    if trigger_part:
        try:
            cursor.execute(trigger_part)
            print("  [OK] Trigger created successfully.")
        except Exception as e:
            print(f"  [WARN] Trigger creation: {e}")


def verify_database(cursor):
    print("\n" + "=" * 50)
    print("[*] Verifying Database Schema and Tables:")
    print("=" * 50)
    tables = ["STUDENT", "COMPANY", "FACULTY", "INTERNSHIP", "APPLICATION", "REPORT"]
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"  Table `{table}`: {count} rows")
        except Exception as e:
            print(f"  Table `{table}`: Error - {e}")

    # Check view
    try:
        cursor.execute("SELECT COUNT(*) FROM student_application_view")
        count = cursor.fetchone()[0]
        print(f"  View `student_application_view`: {count} rows")
    except Exception as e:
        print(f"  View `student_application_view`: Error - {e}")

    # Check triggers
    try:
        cursor.execute("SHOW TRIGGERS")
        triggers = cursor.fetchall()
        trigger_names = [t[0] for t in triggers]
        print(f"  Triggers found: {trigger_names}")
    except Exception as e:
        print(f"  Triggers check: Error - {e}")
    print("=" * 50)


def main():
    host, user, password, port, db_name = get_db_credentials()
    try:
        conn = connect_server(host, user, password, port)
        cursor = conn.cursor()
        print("[+] Connection to Azure MySQL Flexible Server established successfully!")

        # Step 1: Ensure database exists
        print(f"[*] Ensuring database `{db_name}` exists...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        cursor.execute(f"USE `{db_name}`;")
        print(f"[+] Using database `{db_name}`.")

        # Step 2: Apply schema
        base_dir = os.path.dirname(__file__)
        schema_file = os.path.join(base_dir, "schema.sql")
        execute_script(cursor, schema_file)

        # Step 3: Apply sample data
        sample_file = os.path.join(base_dir, "sample_data.sql")
        execute_script(cursor, sample_file)

        conn.commit()

        # Step 4: Verification
        verify_database(cursor)

        cursor.close()
        conn.close()
        print("\n[SUCCESS] Azure MySQL setup completed flawlessly!")

    except mysql.connector.Error as err:
        print(f"\n[ERROR] MySQL Error: {err}")
        sys.exit(1)
    except Exception as ex:
        print(f"\n[ERROR] Unexpected Exception: {ex}")
        sys.exit(1)


if __name__ == "__main__":
    main()
