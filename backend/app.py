from flask import Flask, jsonify, request, send_from_directory
from db_config import cursor, db
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

def allowed_file(filename):

    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Upload configuration
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}
app.config.setdefault('MAX_CONTENT_LENGTH', 10 * 1024 * 1024)  # 10 MB

# uploads directory (sibling to backend folder)
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def api_response(success=True, data=None, message=None, error=None, status=200, meta=None):
    """Return a standardized JSON response.

    Format:
    {
      "success": bool,
      "data": ... (optional),
      "message": "..." (optional),
      "error": {"message": "..."} (optional),
      "meta": { ... } (optional)
    }
    """
    payload = {"success": bool(success)}
    if data is not None:
        payload["data"] = data
    if message:
        payload["message"] = message
    if error:
        payload["error"] = error
    if meta:
        payload["meta"] = meta
    return jsonify(payload), status


@app.route('/')
def home():
    return api_response(success=True, message="Backend running", data={"status": "running"})


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

        return api_response(success=True, data=internships)

    except Exception as e:

        return api_response(success=False, error={"message": str(e)}, status=500)


# API to list reports
@app.route('/reports', methods=['GET'])
def list_reports():
    try:
        query = """
        SELECT
            Report_ID,
            Student_ID,
            Faculty_ID,
            File_Path,
            Submission_Date
        FROM REPORT
        """
        cursor.execute(query)
        reports = cursor.fetchall()
        return api_response(success=True, data=reports)
    except Exception as e:
        return api_response(success=False, error={"message": str(e)}, status=500)


# API to get report metadata
@app.route('/reports/<int:report_id>', methods=['GET'])
def get_report(report_id):
    try:
        query = """
        SELECT
            Report_ID,
            Student_ID,
            Faculty_ID,
            File_Path,
            Submission_Date
        FROM REPORT
        WHERE Report_ID = %s
        """
        cursor.execute(query, (report_id,))
        report = cursor.fetchone()
        if not report:
            return api_response(success=False, error={"message": "Report not found"}, status=404)
        return api_response(success=True, data=report)
    except Exception as e:
        return api_response(success=False, error={"message": str(e)}, status=500)


# API to download report file
@app.route('/reports/<int:report_id>/download', methods=['GET'])
def download_report(report_id):
    try:
        query = "SELECT File_Path FROM REPORT WHERE Report_ID = %s"
        cursor.execute(query, (report_id,))
        row = cursor.fetchone()
        if not row:
            return api_response(success=False, error={"message": "Report not found"}, status=404)
        file_path = row.get('File_Path') if isinstance(row, dict) else row[0]
        # Build absolute path and ensure it's inside uploads folder
        file_abspath = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), file_path))
        uploads_abs = os.path.abspath(app.config['UPLOAD_FOLDER'])
        if not file_abspath.startswith(uploads_abs):
            return api_response(success=False, error={"message": "Invalid file path"}, status=400)
        if not os.path.exists(file_abspath):
            return api_response(success=False, error={"message": "File not found on server"}, status=404)
        directory = os.path.dirname(file_abspath)
        filename = os.path.basename(file_abspath)
        return send_from_directory(directory, filename, as_attachment=True)
    except Exception as e:
        return api_response(success=False, error={"message": str(e)}, status=500)

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

        return api_response(success=True, data=applications)

    except Exception as e:

        return api_response(success=False, error={"message": str(e)}, status=500)

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

        return api_response(success=True, data=applications)

    except Exception as e:

        return api_response(success=False, error={"message": str(e)}, status=500)
    
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

        return api_response(success=True, data=applications)

    except Exception as e:

        return api_response(success=False, error={"message": str(e)}, status=500)

# API to register a new student

@app.route('/register-student', methods=['POST'])
def register_student():

    try:

        data = request.get_json()

        # Check if JSON data is received
        if not data:
            return api_response(success=False, error={"message": "No data received"}, status=400)

        name = data.get('name')
        dept = data.get('dept')
        email = data.get('email')
        phone = data.get('phone')
        skills = data.get('skills')
        cgpa = data.get('cgpa')

        # Check required fields
        if not name or not dept or not email:
            return api_response(success=False, error={"message": "Missing required fields"}, status=400)


        # Check if student already exists
        check_query = """
        SELECT * FROM STUDENT
        WHERE Email = %s
        """

        cursor.execute(check_query, (email,))

        existing_student = cursor.fetchone()

        if existing_student:
            return api_response(success=False, error={"message": "Student already registered"}, status=400)


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

        return api_response(success=True, message="Student registered successfully", status=201)

    except Exception as e:

        db.rollback()

        return api_response(success=False, error={"message": str(e)}, status=500)

# API to login student

@app.route('/login-student', methods=['POST'])
def login_student():

    try:

        data = request.get_json()

        # Check if JSON data is received
        if not data:
            return api_response(success=False, error={"message": "No data received"}, status=400)

        email = data.get('email')

        # Check required field
        if not email:
            return api_response(success=False, error={"message": "Email is required"}, status=400)


        query = """
        SELECT
            Student_ID,
            Name,
            Dept,
            Email,
            Phone,
            Skills,
            CGPA

        FROM STUDENT

        WHERE Email = %s
        """

        cursor.execute(query, (email,))

        student = cursor.fetchone()

        # Check if student exists
        if not student:
            return api_response(success=False, error={"message": "Student not found"}, status=404)

        return api_response(success=True, data={"student": student}, message="Login successful")

    except Exception as e:

        return api_response(success=False, error={"message": str(e)}, status=500)
    
 # API for apply internships
@app.route('/apply', methods=['POST'])
def apply_internship():

    try:

        data = request.get_json()

        # Check if JSON data is received
        if not data:
            return api_response(success=False, error={"message": "No data received"}, status=400)

        student_id = data.get('student_id')
        internship_id = data.get('internship_id')

        # Check required fields
        if not student_id or not internship_id:
            return api_response(success=False, error={"message": "Missing required fields"}, status=400)


        # Check duplicate application
        check_query = """
        SELECT * FROM APPLICATION
        WHERE Student_ID = %s
        AND Internship_ID = %s
        """

        cursor.execute(check_query, (student_id, internship_id))

        existing_application = cursor.fetchone()

        if existing_application:
            return api_response(success=False, error={"message": "Student already applied for this internship"}, status=400)


        status = "Applied"

        query = """
        INSERT INTO APPLICATION
        (Student_ID, Internship_ID, Status, Apply_Date)

        VALUES (%s, %s, %s, CURDATE())
        """

        values = (student_id, internship_id, status)

        cursor.execute(query, values)

        db.commit()

        return api_response(success=True, message="Application submitted successfully", status=201)

    except Exception as e:

        db.rollback()

        return api_response(success=False, error={"message": str(e)}, status=500)

# API to update application status

@app.route('/update-status', methods=['PUT'])
def update_application_status():

    try:

        data = request.get_json()

        if not data:
            return api_response(success=False, error={"message": "No data received"}, status=400)

        app_id = data.get('app_id')
        status = data.get('status')

        if not app_id or not status:
            return api_response(success=False, error={"message": "Missing required fields"}, status=400)


        query = """
        UPDATE APPLICATION
        SET Status = %s
        WHERE App_ID = %s
        """

        values = (status, app_id)

        cursor.execute(query, values)

        db.commit()

        return api_response(success=True, message="Application status updated successfully")

    except Exception as e:

        db.rollback()

        return api_response(success=False, error={"message": str(e)}, status=500)
        
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

        return api_response(success=True, data=students)

    except Exception as e:

        return api_response(success=False, error={"message": str(e)}, status=500)
    

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

        return api_response(success=True, data=companies)

    except Exception as e:

        return api_response(success=False, error={"message": str(e)}, status=500)

# API to add internship

@app.route('/add-internship', methods=['POST'])
def add_internship():

    try:

        data = request.get_json()

        if not data:
            return api_response(success=False, error={"message": "No data received"}, status=400)

        company_id = data.get('company_id')
        role = data.get('role')
        duration = data.get('duration')
        stipend = data.get('stipend')

        if not company_id or not role:
            return api_response(success=False, error={"message": "Missing required fields"}, status=400)


        query = """
        INSERT INTO INTERNSHIP
        (Company_ID, Role, Duration, Stipend)

        VALUES (%s, %s, %s, %s)
        """

        values = (
            company_id,
            role,
            duration,
            stipend
        )


        cursor.execute(query, values)

        db.commit()

        return api_response(success=True, message="Internship added successfully", status=201)

    except Exception as e:

        db.rollback()

        return api_response(success=False, error={"message": str(e)}, status=500)
    
# API to delete internship

@app.route('/delete-internship/<int:internship_id>', methods=['DELETE'])
def delete_internship(internship_id):

    try:

        # Check if internship exists
        check_query = """
        SELECT * FROM INTERNSHIP
        WHERE Internship_ID = %s
        """

        cursor.execute(check_query, (internship_id,))

        internship = cursor.fetchone()

        if not internship:
            return api_response(success=False, error={"message": "Internship not found"}, status=404)


        # Delete internship
        query = """
        DELETE FROM INTERNSHIP
        WHERE Internship_ID = %s
        """

        cursor.execute(query, (internship_id,))

        db.commit()

        return api_response(success=True, message="Internship deleted successfully")

    except Exception as e:

        db.rollback()

        return api_response(success=False, error={"message": "Cannot delete internship because applications exist for it"}, status=400)


# API to upload report file
@app.route('/upload-report', methods=['POST'])
def upload_report():

    try:

        # Check file exists in request
        if 'file' not in request.files:
            return api_response(
                success=False,
                error={"message": "No file part in the request"},
                status=400
            )

        file = request.files['file']

        # Check file selected
        if file.filename == '':
            return api_response(
                success=False,
                error={"message": "No selected file"},
                status=400
            )

        # Get form data
        student_id = request.form.get('student_id')
        faculty_id = request.form.get('faculty_id')

        # Validate required fields
        if not student_id:
            return api_response(
                success=False,
                error={"message": "student_id is required"},
                status=400
            )

        # Secure filename
        filename = secure_filename(file.filename)

        # Validate file type
        if not allowed_file(filename):
            return api_response(
                success=False,
                error={
                    "message": f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
                },
                status=400
            )

        # Create unique filename
        timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        stored_filename = f"{timestamp}_{filename}"

        # Full file path
        stored_path = os.path.join(
            app.config['UPLOAD_FOLDER'],
            stored_filename
        )

        # Save file
        file.save(stored_path)

        # Relative path for database
        rel_path = os.path.join(
            'uploads',
            stored_filename
        ).replace('\\', '/')

        # Insert into REPORT table
        query = """
        INSERT INTO REPORT
        (Student_ID, Faculty_ID, File_Path, Submission_Date)

        VALUES (%s, %s, %s, CURDATE())
        """

        values = (
            student_id,
            faculty_id,
            rel_path
        )

        cursor.execute(query, values)

        db.commit()

        report_id = cursor.lastrowid

        return api_response(
            success=True,
            message="Report uploaded successfully",
            data={
                "report_id": report_id,
                "file_path": rel_path
            },
            status=201
        )

    except Exception as e:

        db.rollback()

        return api_response(
            success=False,
            error={"message": str(e)},
            status=500
        )
    
if __name__ == '__main__':
    app.run(debug=True)
