"""Database connection helper for MySQL.

This module establishes a single MySQL connection using environment
variables. It creates a buffered, dictionary cursor to make common
select/iterate patterns easier in the Flask app.

Important: keep credentials in environment variables and out of
source control. For local development, use a `.env` file loaded by
`python-dotenv`.
"""

import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()


def _connect():
    """Create and return a new MySQL connection.

    Reads credentials from environment variables. When DB_HOST looks
    like a Railway hostname (contains 'railway') SSL is NOT explicitly
    disabled so the driver can negotiate a secure connection.
    """
    host = os.getenv("DB_HOST")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")
    database = os.getenv("DB_NAME")
    port = int(os.getenv("DB_PORT", 3306))

    kwargs = dict(
        host=host,
        user=user,
        password=password,
        database=database,
        port=port,
    )

    # Railway (and many cloud MySQL providers) require SSL.
    # mysql-connector-python respects ssl_disabled; setting it to False
    # lets the driver negotiate TLS when the server supports it.
    if host and "railway" in host.lower():
        kwargs["ssl_disabled"] = False

    return mysql.connector.connect(**kwargs)


def get_db():
    """Return the current module-level connection, reconnecting if needed."""
    global db, cursor
    try:
        if db is None or not db.is_connected():
            db = _connect()
            cursor = db.cursor(dictionary=True, buffered=True)
    except Exception:
        # Re-raise so callers know the DB is unavailable
        raise
    return db


def get_cursor():
    """Return a cursor on a live connection."""
    get_db()
    return cursor


# Initial connection — wrapped in try/except so the app can still
# start even if the database is temporarily unreachable. Routes will
# attempt to reconnect via get_db()/get_cursor() on each request.
try:
    db = _connect()
    # Use a buffered, dictionary cursor by default. `dictionary=True`
    # returns rows as dicts which simplifies JSON serialization, and
    # `buffered=True` avoids 'Commands out of sync' when multiple
    # execute/fetch cycles are used on the same connection.
    cursor = db.cursor(dictionary=True, buffered=True)
except Exception as e:
    print(f"[db_config] Initial MySQL connection failed: {e}")
    db = None
    cursor = None