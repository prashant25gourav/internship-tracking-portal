from flask import Flask, jsonify, request
from db_config import cursor, db

app = Flask(__name__)

@app.route('/')
def home():
    return "Internship Tracking Portal Backend Running"


# API to fetch internships
@app.route('/internships')
def get_internships():

    query = """
    SELECT
        INTERNSHIP.Internship_ID,
        COMPANY.Company_Name,
        INTERNSHIP.Role,
        INTERNSHIP.Duration,
        INTERNSHIP.Stipend

    FROM INTERNSHIP

    JOIN COMPANY
    ON INTERNSHIP.Company_ID = COMPANY.Company_ID
    """

    cursor.execute(query)

    internships = cursor.fetchall()

    return jsonify(internships)

# API to fetch applications
@app.route('/applications')
def get_applications():

    query = """
    SELECT 
        APPLICATION.App_ID,
        STUDENT.Name AS Student_Name,
        INTERNSHIP.Role,
        APPLICATION.Status,
        APPLICATION.Apply_Date

    FROM APPLICATION

    JOIN STUDENT
    ON APPLICATION.Student_ID = STUDENT.Student_ID

    JOIN INTERNSHIP
    ON APPLICATION.Internship_ID = INTERNSHIP.Internship_ID
    """

    cursor.execute(query)

    applications = cursor.fetchall()

    return jsonify(applications)




# API to apply for internship

@app.route('/apply', methods=['POST'])
def apply_internship():

    data = request.get_json()

    # Check if JSON data is received
    if not data:
        return jsonify({
            "error": "No data received"
        }), 400

    student_id = data.get('student_id')
    internship_id = data.get('internship_id')

    # Check required fields
    if not student_id or not internship_id:
        return jsonify({
            "error": "Missing required fields"
        }), 400

    status = "Applied"

    query = """
    INSERT INTO APPLICATION
    (Student_ID, Internship_ID, Status, Apply_Date)

    VALUES (%s, %s, %s, CURDATE())
    """

    values = (student_id, internship_id, status)

    cursor.execute(query, values)

    db.commit()

    return jsonify({
        "message": "Application submitted successfully"
    })

# API to fetch all students

@app.route('/students')
def get_students():

    query = """
    SELECT
        Student_ID,
        Name,
        Dept,
        Email,
        Skills,
        CGPA

    FROM STUDENT
    """

    cursor.execute(query)

    students = cursor.fetchall()

    return jsonify(students)

# API to fetch all companies

@app.route('/companies')
def get_companies():

    query = """
    SELECT
        Company_ID,
        Company_Name,
        Location,
        HR_Email

    FROM COMPANY
    """

    cursor.execute(query)

    companies = cursor.fetchall()

    return jsonify(companies)
if __name__ == '__main__':
    app.run(debug=True)
