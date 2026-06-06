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

# Create DB connection from environment variables. The `port` falls
# back to 3306 if not provided.
db = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
    port=int(os.getenv("DB_PORT", 3306))
)

# Use a buffered, dictionary cursor by default. `dictionary=True`
# returns rows as dicts which simplifies JSON serialization, and
# `buffered=True` avoids 'Commands out of sync' when multiple
# execute/fetch cycles are used on the same connection.
cursor = db.cursor(dictionary=True, buffered=True)