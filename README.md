# Internship Tracking Portal

A full-stack enterprise web application for managing internship opportunities, student applications, report submissions, and administrative monitoring within an academic institution.

---

## 🌐 Live Deployments

### ☁️ Microsoft Azure Microservices (Primary Production)
* **Frontend Web Portal (React + Nginx)**: [https://internship-portal-frontend.lemongrass-caaf84c0.uaenorth.azurecontainerapps.io](https://internship-portal-frontend.lemongrass-caaf84c0.uaenorth.azurecontainerapps.io)
* **Backend REST API (Flask + Gunicorn)**: [https://internship-backend.lemongrass-caaf84c0.uaenorth.azurecontainerapps.io](https://internship-backend.lemongrass-caaf84c0.uaenorth.azurecontainerapps.io)
* **Relational Database**: Azure Database for MySQL Flexible Server (`internship-portal-mysql.mysql.database.azure.com:3306`)
* **Container Registry**: GitHub Container Registry (`ghcr.io`)
* **CI/CD**: GitHub Actions Cloud Pipelines


---


## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router DOM, Framer Motion, Lucide Icons |
| **Backend** | Python 3.11, Flask, Gunicorn, PyJWT, Werkzeug (PBKDF2 Hashing) |
| **Databases** | MySQL 8.0 (Azure Database for MySQL Flexible Server), MongoDB Atlas (NoSQL Telemetry & GridFS) |
| **DevOps & Containers** | Docker, Docker Compose, Nginx Alpine, Multi-Stage Builds |
| **Cloud & Serverless** | Azure Container Apps (Scale-to-Zero), Azure Database for MySQL, GitHub Actions, GHCR |

---

## 🚀 Core Features

### 🎓 Student Module
* **Student Registration & Login**: Department selection, skill tagging, and secure PBKDF2 password hashing.
* **Internship Catalog**: Filterable opportunity listings with stipend, duration, and corporate details.
* **One-Click Application**: Streamlined application workflow with database-level duplicate prevention.
* **Real-time Status Tracking**: Live visual stages (`Applied` → `Interview` → `Selected` / `Rejected`).
* **Internship Report Submission**: PDF/DOC file upload stored durably via MongoDB GridFS.

### 🛡️ Administrative & Faculty Module
* **Departmental Analytics Hub**: Visual metric counters (Total Openings, Applicants, Selected Rates, Audit Counts).
* **Application Review System**: Instant status transitions with audit logs.
* **Document Verification**: Real-time polling and streaming download of submitted student reports.
* **Internship Management**: Create new company openings and archive expired postings.
* **Live Activity Monitoring**: Real-time reverse-chronological event audit stream.

---

## 🗄️ Database Architecture & Integrity

### Relational Schema (MySQL)
* **`STUDENT`**: Stores academic profiles with CGPA domain constraints.
* **`COMPANY`**: Corporate partner records with unique HR contact emails.
* **`FACULTY`**: Academic department coordinators and administrators.
* **`INTERNSHIP`**: Corporate job postings linked by `Company_ID` foreign key.
* **`APPLICATION`**: Bridge entity linking students to internships with composite unique checks.
* **`DOCUMENT`**: Report upload metadata referencing MongoDB GridFS chunk identifiers.

### Database View: `student_application_view`
Encapsulates a 4-table relational join (`APPLICATION`, `STUDENT`, `INTERNSHIP`, `COMPANY`) into a single virtual table for real-time reporting and administrative dashboards.

### Database Trigger: `prevent_invalid_cgpa`
Enforces domain integrity at the database storage engine level (`BEFORE INSERT`). Rejects CGPA values outside the allowed `0.00 – 10.00` range using `SIGNAL SQLSTATE '45000'`.

---

## 🏗️ Cloud & Microservices Architecture

```
Internet ──▶ [ Azure Container Apps: Frontend (Nginx Alpine) ] ── (Port 80)
                             │
                             ▼ (HTTPS / CORS)
             [ Azure Container Apps: Backend (Flask + Gunicorn) ] ── (Port 5000)
                             │
             ┌───────────────┴───────────────┐
             ▼ (TLS 1.2 Encrypted)           ▼
  [ Azure Database for MySQL ]      [ MongoDB Atlas Cloud ]
  • Flexible Server (B1ms)          • Activity Logs
  • Tables, Triggers, Views         • GridFS Report Blobs
```

---

## 💻 Local Development Quickstart

### Prerequisites
* Python 3.11+
* Node.js 20+
* MySQL 8.0 & MongoDB (or free cloud instances)

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/prashant25gourav/internship-tracking-portal.git
cd internship-tracking-portal

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (copy and fill in credentials)
cp .env.example .env

# Run database migration (if using Azure MySQL or local MySQL)
python database/azure_setup_db.py

# Start Flask backend
cd backend
python -m flask run --port 5000
```

### 2. Frontend Setup
```bash
cd frontend

# Install NPM dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser!

### 3. Docker Local Build
```bash
# Build backend image
docker build -t internship-backend:local .

# Build frontend image
docker build -t internship-frontend:local ./frontend
```

---

## 📁 Project Structure

```text
internship-tracking-portal/
│
├── .github/
│   └── workflows/
│       └── docker-build.yml    # GitHub Actions CI/CD to build & push to GHCR
│
├── backend/                    # Python Flask REST API
│   ├── app.py                  # API routes, business logic, CORS, handlers
│   ├── auth.py                 # JWT generation and role verification decorators
│   ├── db_config.py            # MySQL connector, SSL, and reconnection logic
│   └── mongo_config.py         # MongoDB Atlas client & GridFS file handlers
│
├── frontend/                   # React + Vite Frontend
│   ├── public/
│   │   └── staticwebapp.config.json # SPA client routing configuration
│   ├── src/                    # UI Components, Views, and API clients
│   │   ├── api.js              # Centralized Fetch wrapper with JWT headers
│   │   └── pages/              # Student, Admin, and Authentication views
│   ├── Dockerfile              # Multi-stage build (Node 20 -> Nginx Alpine)
│   ├── nginx.conf              # Production Nginx server configuration
│   ├── package.json
│   └── vite.config.js
│
├── database/                   # Database Schemas & Migrations
│   ├── azure_setup_db.py       # Automated Azure MySQL schema & data setup script
│   ├── schema.sql              # MySQL DDL (Tables, constraints, view, trigger)
│   └── sample_data.sql         # Seed data for academic demo
│
├── docs/                       # Project presentation, ER diagram, and poster
├── Dockerfile                  # Production backend Dockerfile (Python 3.11 Slim)
├── .dockerignore               # Optimized Docker build context exclusions
├── requirements.txt            # Python dependencies
└── README.md
```

---

## 👥 Team Members

* **Prashant Gourav**
* **Mohan Murari Sharma**
* **Bhavika Chandar**
* **Shivangi Tiwari**

---

## 🎓 Academic Evaluation

Developed as a **Database Management Systems (DBMS)** project demonstrating advanced full-stack web engineering, ACID relational schema design, NoSQL document telemetry, cloud containerization, and modern CI/CD DevOps workflows.
