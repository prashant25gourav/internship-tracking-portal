# Internship Tracking Portal

A full-stack web application for managing internship opportunities, student applications, report submissions, and administrative monitoring within an academic institution.

---

## Live Demo

**Frontend:**
https://internship-frontend-3qid.onrender.com

**Backend API:**
https://internship-backend-5ymz.onrender.com

---

## Project Overview

The Internship Tracking Portal streamlines the internship management process by providing a centralized platform where students can discover opportunities, apply for internships, upload reports, and track their progress, while administrators can manage applications, review submissions, and monitor platform activity.

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript

### Backend

* Flask
* Python
* REST APIs
* JWT Authentication

### Database

* MySQL (Railway)
* MongoDB Atlas

### Deployment

* Render (Frontend & Backend)
* Railway (MySQL Hosting)
* MongoDB Atlas (Cloud Storage)

---

## Core Features

### Student Module

* Student Registration & Login
* Internship Browsing
* Internship Applications
* Application Status Tracking
* Internship Report Upload

### Admin Module

* Secure Authentication
* Application Management
* Report Review System
* Analytics Dashboard
* Activity Monitoring

---

## Database Highlights

### Database View

**student_application_view**

Provides a consolidated view of:

* Student Details
* Internship Information
* Company Information
* Application Status

### Database Trigger

**prevent_invalid_cgpa**

Automatically prevents insertion of invalid CGPA values outside the allowed 0–10 range.

### Data Integrity

* Foreign Key Constraints
* CHECK Constraints
* Referential Integrity Enforcement

---

## System Architecture

Frontend (React + Vite)
↓
Backend (Flask REST APIs)
↓
MySQL (Structured Data)

MongoDB Atlas
↓
Report Storage & Activity Logs

---

## Screenshots

### Login Page

![Login](docs/diagrams/dashboard.png)

### Student Dashboard

![Student Dashboard](docs/diagrams/student.png)

### Admin Dashboard

![Admin Dashboard](docs/diagrams/admin.png)

---

## Project Structure

```text
internship-tracking-portal/
│
├── backend/        Flask APIs and business logic
├── frontend/       React application
├── database/       SQL schema and database scripts
├── docs/           Report, PPT, diagrams and poster
│
├── requirements.txt
├── render.yaml
├── README.md
└── .env.example
```

---

## Documentation

The `docs` directory contains:

* Project Report
* Presentation (PPT)
* ER Diagram
* Database Schema Diagram
* Project Poster

---

## Team Members

* Prashant Gourav
* Mohan Murari Sharma
* Bhavika Chandar
* Shivangi Tiwari

---

## Academic Project

Developed as part of a Database Management Systems (DBMS) academic project, demonstrating full-stack development, database design, cloud integration, authentication, and deployment practices.
