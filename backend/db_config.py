import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

db = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
    port=int(os.getenv("DB_PORT", 3306))
)

# Use a buffered cursor by default to avoid 'Commands out of sync' errors
# when multiple execute/fetch cycles occur on the same connection.
cursor = db.cursor(dictionary=True, buffered=True)