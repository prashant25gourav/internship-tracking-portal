# Internship Tracking Portal

## 📌 Overview

The Internship Tracking Portal is a full-stack web application designed to streamline internship management and tracking for students, faculty/admins, and organizations.

The platform enables students to:

* register and login
* browse internship opportunities
* apply for internships
* track application progress
* upload internship reports
* download submitted reports

Faculty/Admins can:

* monitor internship activities
* manage student applications
* review uploaded reports
* access analytics dashboards
* monitor platform activity logs

The project demonstrates:

* RESTful API development
* Hybrid database architecture
* JWT-protected admin analytics
* File upload & management
* Activity tracking & analytics
* Frontend-backend integration
* Team collaboration using Git & GitHub

---

# 🏗 System Architecture

The project uses a **Hybrid Database Architecture**:

* **MySQL** handles structured transactional data such as:

  * students
  * internships
  * applications
  * reports

* **MongoDB** is used for semi-structured behavioral analytics and activity logging, including:

  * student logins
  * internship applications
  * report uploads
  * report downloads

This architecture demonstrates **Polyglot Persistence**, where multiple databases are used based on their strengths.

---

# 🛠 Tech Stack

## Frontend

* React.js
* JavaScript
* CSS

## Backend

* Flask (Python)
* Flask-CORS
* PyJWT

## Databases

* MySQL
* MongoDB

## Tools & Platforms

* Git
* GitHub
* VS Code
* Thunder Client
* MongoDB Compass

---

# 🚀 Features

## 👨‍🎓 Student Features

* Student Registration
* Student Login
* Browse Available Internships
* Apply for Internships
* Track Application Status
* Upload Internship Reports
* Download Uploaded Reports

---

## 👨‍🏫 Faculty/Admin Features

* Add Internship Opportunities
* View Student Applications
* Monitor Uploaded Reports
* Access Analytics Dashboard
* View Recent Activity Logs
* Protected Analytics APIs using JWT Authentication

---

## 📊 Analytics & Monitoring Features

* Activity Tracking System
* Login Analytics
* Internship Application Analytics
* Report Upload Analytics
* Report Download Analytics
* Recent Activity Feed
* Dashboard Summary APIs

---

## ⚙ System Features

* RESTful API Architecture
* Standardized API Responses
* JWT-Protected Admin Routes
* MongoDB Activity Logging
* File Upload & Download System
* Foreign Key Constraints
* Input Validation & Error Handling
* Environment Variable Configuration
* Secure File Path Validation
* Modular Backend Structure

---

# 📂 Project Structure

```bash
internship-tracking-portal/
│
├── frontend/              # React frontend
├── backend/               # Flask backend APIs
├── database/              # SQL schema & sample data
├── uploads/               # Uploaded reports/documents
├── docs/                  # PPT, diagrams, reports
│
├── .env.example
├── README.md
├── requirements.txt
└── .gitignore
```

---

# 🔐 Authentication & Security

The system implements lightweight JWT-based authentication for admin analytics routes.

Security features include:

* JWT-protected analytics APIs
* File type validation
* Upload size restrictions
* Path traversal protection
* Environment variable configuration
* Structured error handling

---

# 📊 Analytics APIs

The backend provides analytics-focused APIs for dashboard integration.

Example APIs:

* `/analytics/summary`
* `/analytics/recent-activities`
* `/analytics/applications/status-breakdown`

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

MONGO_URI=mongodb://localhost:27017/

ADMIN_PASSWORD=admin123
AUTH_SECRET=mysecretkey
```

---

## 5. Run Backend Server

```bash
python backend/app.py
```

---

# 👥 Team Members

* Prashant Gourav
* Mohan Murari Sharma
* Bhavika Chandar
* Shivangi Tiwari

---

# 📌 Project Highlights

* Hybrid MySQL + MongoDB Architecture
* Event-Driven Activity Tracking
* JWT-Protected Admin Analytics
* Dashboard-Ready APIs
* Scalable Analytics System
* Structured + Semi-Structured Data Handling
* Full-Stack Team Collaboration
