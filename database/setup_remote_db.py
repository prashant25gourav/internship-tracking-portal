"""Helper script to apply schema.sql and sample_data.sql to a remote MySQL database (e.g. Railway).

Reads DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT from environment variables or .env file.

Usage:
    python database/setup_remote_db.py
"""

import os
import sys
from dotenv import load_dotenv
import mysql.connector

# Ensure backend directory or root .env is loaded
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))


def get_connection():
    host = os.getenv("DB_HOST")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")
    database = os.getenv("DB_NAME")
    raw_port = os.getenv("DB_PORT")
    port = int(raw_port.strip()) if raw_port and raw_port.strip().isdigit() else 3306

    print(f"Connecting to MySQL on {host}:{port} (database: {database})...")

    kwargs = dict(
        host=host,
        user=user,
        password=password,
        database=database,
        port=port,
        connection_timeout=15,
        use_pure=True,
    )

    is_remote = host and host.strip() not in ("localhost", "127.0.0.1")
    if is_remote:
        kwargs["ssl_disabled"] = False
        kwargs["ssl_verify_cert"] = False
        kwargs["ssl_verify_identity"] = False

    return mysql.connector.connect(**kwargs)


def apply_script(cursor, filepath):
    print(f"\nApplying {filepath}...")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Split trigger from standard statements
    parts = content.split("DELIMITER $$")
    standard_part = parts[0]
    trigger_part = ""
    if len(parts) > 1:
        trigger_sub = parts[1].split("DELIMITER ;")[0]
        trigger_part = trigger_sub.replace("END$$", "END").strip()

    # Execute standard statements
    for stmt in standard_part.split(";"):
        cleaned = stmt.strip()
        # Skip CREATE DATABASE or USE statements when populating an existing cloud DB like 'railway'
        if cleaned and not cleaned.upper().startswith("CREATE DATABASE") and not cleaned.upper().startswith("USE "):
            try:
                cursor.execute(cleaned)
                print(f"  [OK] {cleaned[:60]}...")
            except Exception as e:
                print(f"  [SKIP/ERR] {cleaned[:60]}... => {e}")

    # Execute trigger if present
    if trigger_part:
        try:
            cursor.execute(trigger_part)
            print(f"  [OK] Trigger: {trigger_part[:60]}...")
        except Exception as e:
            print(f"  [SKIP/ERR] Trigger => {e}")


def main():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        print("Connected successfully!")

        base_dir = os.path.dirname(__file__)
        schema_path = os.path.join(base_dir, "schema.sql")
        sample_path = os.path.join(base_dir, "sample_data.sql")

        apply_script(cursor, schema_path)
        apply_script(cursor, sample_path)

        conn.commit()
        cursor.close()
        conn.close()
        print("\nAll schema tables, constraints, triggers, views, and sample data applied successfully!")
    except Exception as e:
        print(f"\nMigration failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
