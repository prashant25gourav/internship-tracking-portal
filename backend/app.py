from flask import Flask, jsonify, request
from db_config import cursor, db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Internship Tracking Portal Backend Running"


# API to fetch internships
@app.route('/internships')
def get_internships():

    try:

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

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# API to fetch applications
@app.route('/applications')
def get_applications():

    try:

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

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# API to fetch applications of a specific student

@app.route('/student-applications/<int:student_id>')
def get_student_applications(student_id):

    try:

        query = """
        SELECT
            APPLICATION.App_ID,
            INTERNSHIP.Role,
            APPLICATION.Status,
            APPLICATION.Apply_Date

        FROM APPLICATION

        JOIN INTERNSHIP
        ON APPLICATION.Internship_ID = INTERNSHIP.Internship_ID

        WHERE APPLICATION.Student_ID = %s
        """

        cursor.execute(query, (student_id,))

        applications = cursor.fetchall()

        return jsonify(applications)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    
# API to fetch applications for a specific company

@app.route('/company-applications/<int:company_id>')
def get_company_applications(company_id):

    try:

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

        WHERE INTERNSHIP.Company_ID = %s
        """

        cursor.execute(query, (company_id,))

        applications = cursor.fetchall()

        return jsonify(applications)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# API to register a new student

@app.route('/register-student', methods=['POST'])
def register_student():

    try:

        data = request.get_json()

        # Check if JSON data is received
        if not data:
            return jsonify({
                "error": "No data received"
            }), 400

        name = data.get('name')
        dept = data.get('dept')
        email = data.get('email')
        phone = data.get('phone')
        skills = data.get('skills')
        cgpa = data.get('cgpa')

        # Check required fields
        if not name or not dept or not email:
            return jsonify({
                "error": "Missing required fields"
            }), 400


        # Check if student already exists
        check_query = """
        SELECT * FROM STUDENT
        WHERE Email = %s
        """

        cursor.execute(check_query, (email,))

        existing_student = cursor.fetchone()

        if existing_student:
            return jsonify({
                "error": "Student already registered"
            }), 400


        # Insert new student
        query = """
        INSERT INTO STUDENT
        (Name, Dept, Email, Phone, Skills, CGPA)

        VALUES (%s, %s, %s, %s, %s, %s)
        """

        values = (
            name,
            dept,
            email,
            phone,
            skills,
            cgpa
        )

        cursor.execute(query, values)

        db.commit()

        return jsonify({
            "message": "Student registered successfully"
        })

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

 # API for apply internships
@app.route('/apply', methods=['POST'])
def apply_internship():

    try:

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


        # Check duplicate application
        check_query = """
        SELECT * FROM APPLICATION
        WHERE Student_ID = %s
        AND Internship_ID = %s
        """

        cursor.execute(check_query, (student_id, internship_id))

        existing_application = cursor.fetchone()

        if existing_application:
            return jsonify({
                "error": "Student already applied for this internship"
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

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500

# API to update application status

@app.route('/update-status', methods=['PUT'])
def update_application_status():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No data received"
            }), 400

        app_id = data.get('app_id')
        status = data.get('status')

        if not app_id or not status:
            return jsonify({
                "error": "Missing required fields"
            }), 400


        query = """
        UPDATE APPLICATION
        SET Status = %s
        WHERE App_ID = %s
        """

        values = (status, app_id)

        cursor.execute(query, values)

        db.commit()

        return jsonify({
            "message": "Application status updated successfully"
        })

    except Exception as e:

        db.rollback()

        return jsonify({
            "error": str(e)
        }), 500
        
# API to fetch all students

@app.route('/students')
def get_students():

    try:

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

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    

# API to fetch all companies

@app.route('/companies')
def get_companies():

    try:

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

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
if __name__ == '__main__':
    app.run(debug=True)
