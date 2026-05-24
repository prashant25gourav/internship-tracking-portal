import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="2005",
    database="internship_portal"
)

cursor = db.cursor(dictionary=True)