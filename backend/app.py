from flask import Flask, jsonify, request, send_from_directory
from db_config import cursor, db
from flask_cors import CORS
from werkzeug.utils import secure_filename
from mongo_config import log_activity, get_recent_activities, get_activity_count
from auth import create_token, admin_required
import os
from werkzeug.exceptions import RequestEntityTooLarge
from datetime import datetime

app = Flask(__name__)
CORS(app)

def allowed_file(filename):

    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Upload configuration
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}
# Enforce maximum upload size at the request level. Setting the value
# directly (not via setdefault) ensures Werkzeug will reject requests
# whose Content-Length exceeds the limit and raise RequestEntityTooLarge.
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10 MB

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


# Global handler for oversized request bodies (file uploads beyond MAX_CONTENT_LENGTH).
# Werkzeug raises RequestEntityTooLarge when Content-Length exceeds the configured limit.
@app.errorhandler(RequestEntityTooLarge)
def handle_request_entity_too_large(error):
    # Return standardized API response with HTTP 413 Payload Too Large
    return api_response(success=False, error={"message": "File size exceeds 10MB limit"}, status=413)


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

        # Fetch report file path
        query = """
        SELECT File_Path
        FROM REPORT
        WHERE Report_ID = %s
        """

        cursor.execute(query, (report_id,))

        row = cursor.fetchone()

        # Check report exists
        if not row:
            return api_response(
                success=False,
                error={"message": "Report not found"},
                status=404
            )

        # Handle dict or tuple cursor result
        file_path = (
            row.get('File_Path')
            if isinstance(row, dict)
            else row[0]
        )

        # Build absolute file path
        file_abspath = os.path.abspath(
            os.path.join(
                os.path.dirname(os.path.dirname(__file__)),
                file_path
            )
        )

        # Uploads directory absolute path
        uploads_abs = os.path.abspath(
            app.config['UPLOAD_FOLDER']
        )

        # Security check: ensure the file is inside the uploads directory
        try:
            common = os.path.commonpath([uploads_abs, file_abspath])
        except Exception:
            return api_response(success=False, error={"message": "Invalid file path"}, status=400)

        if common != uploads_abs:
            return api_response(success=False, error={"message": "Invalid file path"}, status=400)

        # Check file exists on server
        if not os.path.exists(file_abspath):
            return api_response(
                success=False,
                error={"message": "File not found on server"},
                status=404
            )

        # Extract directory and filename
        directory = os.path.dirname(file_abspath)

        filename = os.path.basename(file_abspath)

        # Log download activity in MongoDB
        log_activity(
            student_id="system",

            activity_type="download_report",
            description="Report downloaded from portal",

            module="reports",
            api=f"/reports/{report_id}/download",
            method="GET",

            extra_data={
                "report_id": report_id,
                "file_name": filename,
                "file_path": file_path
            }
        )

        # Send file download response
        return send_from_directory(
            directory,
            filename,
            as_attachment=True
        )

    except Exception as e:

        return api_response(
            success=False,
            error={"message": str(e)},
            status=500
        )
    
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


# Lightweight API exposing the database VIEW `student_application_view`.
# This is optional and intended for simple read-only access to the
# joined application data for dashboards or admin UIs. It keeps the
# backend behaviour unchanged and simply selects from the DB view.
@app.route('/applications-view')
def get_applications_view():
    try:
        query = """
        SELECT
            Student_ID,
            Student_Name,
            Internship_Role,
            Company_Name,
            Application_Status,
            Apply_Date
        FROM student_application_view
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        return api_response(success=True, data=rows)

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

        # Validate CGPA if provided: ensure numeric and within 0.0 - 10.0
        if cgpa is not None and cgpa != "":
            try:
                cgpa_val = float(cgpa)
            except (ValueError, TypeError):
                return api_response(success=False, error={"message": "CGPA must be a numeric value"}, status=400)
            if cgpa_val < 0 or cgpa_val > 10:
                return api_response(success=False, error={"message": "CGPA must be between 0 and 10"}, status=400)
        else:
            cgpa_val = None


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
            cgpa_val
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
            return api_response(
                success=False,
                error={"message": "No data received"},
                status=400
            )

        email = data.get('email')

        # Check required field
        if not email:
            return api_response(
                success=False,
                error={"message": "Email is required"},
                status=400
            )

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
            return api_response(
                success=False,
                error={"message": "Student not found"},
                status=404
            )

        # Log login activity in MongoDB
        log_activity(
            student_id=student['Student_ID'],

            activity_type="login",
            description="Student logged into the portal",

            module="authentication",
            api="/login-student",
            method="POST",

            extra_data={
                "email": student['Email'],
                "department": student['Dept']
            }
        )

        return api_response(
            success=True,
            data={"student": student},
            message="Login successful"
        )

    except Exception as e:

        return api_response(
            success=False,
            error={"message": str(e)},
            status=500
        )
    
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
        log_activity(
            student_id=student_id,
            activity_type="apply_internship",
            description="Student applied for internship",

            module="applications",
            api="/apply",
            method="POST",

            extra_data={
                "internship_id": internship_id,
                "status": "Applied"
            }
        )

        return api_response(
            success=True,
            message="Application submitted successfully",
            status=201
        )
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


@app.route('/auth/token', methods=['POST'])
def get_auth_token():
    """Issue an admin JWT when the correct ADMIN_PASSWORD is provided in body.

    Body: { "password": "..." }
    """
    try:
        data = request.get_json() or {}
        password = data.get('password')
        if not password:
            return api_response(success=False, error={"message": "Password required"}, status=400)

        admin_password = os.getenv('ADMIN_PASSWORD')
        if not admin_password:
            return api_response(success=False, error={"message": "Server misconfigured: ADMIN_PASSWORD not set"}, status=500)

        if password != admin_password:
            return api_response(success=False, error={"message": "Invalid credentials"}, status=401)

        token = create_token('admin')
        return api_response(success=True, data={"token": token}, message="Token issued")

    except Exception as e:
        return api_response(success=False, error={"message": str(e)}, status=500)


@app.route('/analytics/summary', methods=['GET'])
@admin_required
def analytics_summary():
    """Return key counts for dashboard analytics."""
    try:
        # Query totals from SQL
        cursor.execute("SELECT COUNT(*) AS cnt FROM STUDENT")
        row = cursor.fetchone()
        total_students = int(row['cnt']) if isinstance(row, dict) and row.get('cnt') is not None else int(row[0])

        cursor.execute("SELECT COUNT(*) AS cnt FROM COMPANY")
        row = cursor.fetchone()
        total_companies = int(row['cnt']) if isinstance(row, dict) and row.get('cnt') is not None else int(row[0])

        cursor.execute("SELECT COUNT(*) AS cnt FROM INTERNSHIP")
        row = cursor.fetchone()
        total_internships = int(row['cnt']) if isinstance(row, dict) and row.get('cnt') is not None else int(row[0])

        cursor.execute("SELECT COUNT(*) AS cnt FROM APPLICATION")
        row = cursor.fetchone()
        total_applications = int(row['cnt']) if isinstance(row, dict) and row.get('cnt') is not None else int(row[0])

        cursor.execute("SELECT COUNT(*) AS cnt FROM REPORT")
        row = cursor.fetchone()
        total_reports = int(row['cnt']) if isinstance(row, dict) and row.get('cnt') is not None else int(row[0])

        # Activity logs count from Mongo (feed is provided by /analytics/recent-activities)
        total_activity_logs = get_activity_count()

        return api_response(success=True, data={
            "total_students": total_students,
            "total_companies": total_companies,
            "total_internships": total_internships,
            "total_applications": total_applications,
            "total_reports": total_reports,
            "total_activity_logs": total_activity_logs
        })

    except Exception as e:
        return api_response(success=False, error={"message": str(e)}, status=500)


@app.route('/analytics/applications/status-breakdown', methods=['GET'])
@admin_required
def analytics_app_status_breakdown():
    try:
        query = "SELECT Status, COUNT(*) AS cnt FROM APPLICATION GROUP BY Status"
        cursor.execute(query)
        rows = cursor.fetchall()
        # Normalize rows to list of {status, count}
        breakdown = []
        for r in rows:
            if isinstance(r, dict):
                breakdown.append({"status": r.get('Status'), "count": int(r.get('cnt', 0))})
            else:
                breakdown.append({"status": r[0], "count": int(r[1])})

        return api_response(success=True, data={"breakdown": breakdown})
    except Exception as e:
        return api_response(success=False, error={"message": str(e)}, status=500)


@app.route('/analytics/recent-activities', methods=['GET'])
@admin_required
def analytics_recent_activities():
    try:
        limit = int(request.args.get('limit', 10))
        activities = get_recent_activities(limit=limit)
        return api_response(success=True, data={"activities": activities})
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

        # Log upload activity in MongoDB
        log_activity(
            student_id=student_id,

            activity_type="upload_report",
            description="Student uploaded internship report",

            module="reports",
            api="/upload-report",
            method="POST",

            extra_data={
                "report_id": report_id,
                "file_path": rel_path,
                "file_name": stored_filename,
                "file_type": filename.rsplit('.', 1)[1].lower()
            }
        )

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
