# Internship Tracking Portal

## 📌 Overview

The Internship Tracking Portal is a full-stack web application designed to streamline internship management and tracking for students, faculty/admins, and organizations.

The platform enables students to:

- register and login
- browse internship opportunities
- apply for internships
- track application progress
- upload internship reports
- download submitted reports

Faculty/Admins can:

- monitor internship activities
- manage student applications
- review uploaded reports
- access analytics dashboards
- monitor platform activity logs

The project demonstrates:

- RESTful API development
- Hybrid database architecture
- JWT-protected admin analytics
- File upload & management
- Activity tracking & analytics
- Frontend-backend integration
- Team collaboration using Git & GitHub

---

# 🏗 System Architecture

The project uses a **Hybrid Database Architecture**:

- **MySQL** handles structured transactional data such as:
  - students
  - internships
  - applications
  - reports

- **MongoDB** is used for semi-structured behavioral analytics and activity logging, including:
  - student logins
  - internship applications
  - report uploads
  - report downloads

This architecture demonstrates **Polyglot Persistence**, where multiple databases are used based on their strengths.

---

# 🛠 Tech Stack

## Frontend

- React.js
- JavaScript
- CSS

## Backend

- Flask (Python)
- Flask-CORS
- PyJWT

## Databases

- MySQL
- MongoDB

## Tools & Platforms

- Git
- GitHub
- VS Code
- Thunder Client
- MongoDB Compass

---

# 🚀 Features

## 👨‍🎓 Student Features

- Student Registration
- Student Login
- Browse Available Internships
- Apply for Internships
- Track Application Status
- Upload Internship Reports
- Download Uploaded Reports

---

## 👨‍🏫 Faculty/Admin Features

- Add Internship Opportunities
- View Student Applications
- Monitor Uploaded Reports
- Access Analytics Dashboard
- View Recent Activity Logs
- Protected Analytics APIs using JWT Authentication

---

## 📊 Analytics & Monitoring Features

- Activity Tracking System
- Login Analytics
- Internship Application Analytics
- Report Upload Analytics
- Report Download Analytics
- Recent Activity Feed
- Dashboard Summary APIs

---

## ⚙ System Features

- RESTful API Architecture
- Standardized API Responses
- JWT-Protected Admin Routes
- MongoDB Activity Logging
- File Upload & Download System
- Foreign Key Constraints
- Input Validation & Error Handling
- Environment Variable Configuration
- Secure File Path Validation
- Modular Backend Structure

---

# 📂 Project Structure

```bash
internship-tracking-portal/
│
├── frontend/              # React frontend
├── backend/               # Flask backend APIs
├── database/              # SQL schema & sample data
├── docs/                  # PPT, diagrams, reports
│
├── .env.example
├── README.md
├── requirements.txt
└── .gitignore
```

---

## Initialize Database

If you haven't imported the schema yet, the `database/schema.sql` file
creates the `internship_portal` database and all tables/views/triggers.
Import it using the MySQL CLI:

```bash
# This will prompt for your DB password; the script creates the DB named
# `internship_portal` and runs the contained statements.
mysql -u <DB_USER> -p < database/schema.sql
```

Note: the schema file uses `DELIMITER` for trigger creation; import via
the MySQL CLI or a client that supports delimiter/trigger scripts.

### Reset & Seed (quick)

From the `database/` directory you can reset and re-seed the demo dataset using the MySQL CLI:

```bash
mysql -u <DB_USER> -p internship_portal < reset_db.sql
```

This script truncates tables (temporarily disables foreign key checks) and reloads `sample_data.sql`.

# 🔐 Authentication & Security

The system implements lightweight JWT-based authentication for admin analytics routes.

Security features include:

- JWT-protected analytics APIs
- File type validation
- Upload size restrictions
- Path traversal protection
- Environment variable configuration
- Structured error handling

Notes and dev hints:

- `POST /auth/token` issues an admin JWT when `ADMIN_PASSWORD` matches the `.env` value.
- `POST /login-student` returns a lightweight `token` (role: `student`) alongside student profile data for demo-frontends. This token is intentionally minimal — do not rely on it for production-grade auth without adding passwords and validation.
- Ensure `AUTH_SECRET` and `ADMIN_PASSWORD` are set in `.env` and **do not commit** `.env` to the repository.

---

# 📊 Analytics APIs

The backend provides analytics-focused APIs for dashboard integration.

Example APIs:

- `/analytics/summary`
- `/analytics/recent-activities`
- `/analytics/applications/status-breakdown`

These APIs are protected using JWT authentication and are designed for frontend dashboard integration.

---

# ⚡ API Response Format

All APIs use standardized JSON responses.

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Something went wrong"
  }
}
```

---

# 🚀 Backend Setup

## 1. Clone Repository

```bash
git clone <repository-url>
cd internship-tracking-portal
```

---

## 2. Create Virtual Environment

```bash
python -m venv .venv
```

Activate virtual environment:

### Windows

```bash
.venv\Scripts\activate
```

### Linux / Mac

```bash
source .venv/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create `.env` file using `.env.example`.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=internship_portal

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=internship_portal

# MongoDB (analytics)
MONGO_URI=mongodb://localhost:27017/
MONGO_DB_NAME=internship_portal
MONGO_ACTIVITY_COLLECTION=activity_logs

# Admin / JWT
ADMIN_PASSWORD=admin123
AUTH_SECRET=mysecretkey

# Optional: control debug mode for local runs (True/False)
FLASK_DEBUG=True
```

---

## 5. Run Backend Server

```bash
python backend/app.py
```

Set `FLASK_DEBUG=False` in `.env` to run without Flask debug mode.

---

# 👥 Team Members

- Prashant Gourav
- Mohan Murari Sharma
- Bhavika Chandar
- Shivangi Tiwari

---

# 📌 Project Highlights

- Hybrid MySQL + MongoDB Architecture
- Event-Driven Activity Tracking
- JWT-Protected Admin Analytics
- Dashboard-Ready APIs
- Scalable Analytics System
- Structured + Semi-Structured Data Handling
- Full-Stack Team Collaboration

---

## Database Views & Triggers

This project includes small database-level helpers to make reporting
and validation easier and more robust:

- **SQL View**: `student_application_view` — a read-only view that
  joins `STUDENT`, `APPLICATION`, `INTERNSHIP`, and `COMPANY` to
  provide a compact, dashboard-friendly result set (student name,
  internship role, company name, status, apply date).

- **Trigger**: `prevent_invalid_cgpa` — a `BEFORE INSERT` trigger on
  the `STUDENT` table which rejects inserts where the `CGPA` is
  outside the valid 0.00–10.00 range using `SIGNAL SQLSTATE '45000'`.

Integrity is enforced using foreign keys, CHECK constraints where
supported, and targeted triggers — MySQL does not fully support
`CREATE ASSERTION`, so these mechanisms provide the necessary
business-rule enforcement at the DB layer.

See `database/schema.sql` for the exact SQL definitions and comments.
