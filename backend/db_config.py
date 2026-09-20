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

    Reads credentials from environment variables. When connecting to
    remote/cloud MySQL (like Azure Database for MySQL), enables SSL and forces the
    pure-Python connector implementation to avoid C-extension SSL
    handshake crashes.
    """
    host = os.getenv("DB_HOST")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")
    database = os.getenv("DB_NAME")
    raw_port = os.getenv("DB_PORT")
    port = int(raw_port.strip()) if raw_port and raw_port.strip().isdigit() else 3306

    kwargs = dict(
        host=host,
        user=user,
        password=password,
        database=database,
        port=port,
        connection_timeout=10,
        use_pure=True,
    )

    # For remote databases (including Azure, AWS, etc.), negotiate SSL without
    # strict certificate chain verification (cloud proxies often lack trusted CAs).
    is_remote = host and host.strip() not in ("localhost", "127.0.0.1")
    if is_remote:
        kwargs["ssl_disabled"] = False
        kwargs["ssl_verify_cert"] = False
        kwargs["ssl_verify_identity"] = False

    return mysql.connector.connect(**kwargs)


def get_db():
    """Return the current module-level connection, reconnecting if needed."""
    global db, cursor
    try:
        need_reconnect = False
        if db is None:
            need_reconnect = True
        else:
            try:
                db.ping(reconnect=False)
            except Exception:
                need_reconnect = True

        if need_reconnect:
            db = _connect()
            cursor = db.cursor(dictionary=True, buffered=True)
        elif cursor is None and db is not None:
            cursor = db.cursor(dictionary=True, buffered=True)
    except Exception:
        # Re-raise so callers know the DB is unavailable
        raise
    return db


def get_cursor():
    """Return a cursor on a live connection."""
    global db, cursor
    get_db()
    if cursor is None and db is not None:
        cursor = db.cursor(dictionary=True, buffered=True)
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