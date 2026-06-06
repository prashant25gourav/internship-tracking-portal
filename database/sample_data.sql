
-- =========================================================
-- STUDENTS
-- =========================================================

INSERT INTO STUDENT (Name, Dept, Email, Phone, Skills, CGPA)
VALUES
('Rahul Sharma', 'CSE', 'rahul.sharma@gmail.com', '9876543210', 'Python, React, Flask', 8.50),
('Ananya Singh', 'ISE', 'ananya.singh@gmail.com', '9876543211', 'Java, SQL, Spring Boot', 8.90),
('Arjun Verma', 'ECE', 'arjun.verma@gmail.com', '9876543212', 'C++, Embedded Systems, IoT', 8.10),
('Priya Nair', 'CSE', 'priya.nair@gmail.com', '9876543213', 'Flask, MySQL, REST APIs', 9.00),
('Karan Mehta', 'AIML', 'karan.mehta@gmail.com', '9876543214', 'Machine Learning, Python, TensorFlow', 8.70),
('Sneha Reddy', 'AIML', 'sneha.reddy@gmail.com', '9876543215', 'Deep Learning, NLP, Python', 8.80),
('Vikram Joshi', 'DS', 'vikram.joshi@gmail.com', '9876543216', 'Power BI, SQL, Data Analytics', 8.20),
('Neha Kapoor', 'ISE', 'neha.kapoor@gmail.com', '9876543217', 'React, Node.js, MongoDB', 8.60),
('Rohit Menon', 'CSE', 'rohit.menon@gmail.com', '9876543218', 'Docker, AWS, DevOps', 8.40),
('Ishita Rao', 'ECE', 'ishita.rao@gmail.com', '9876543219', 'VLSI, Embedded C', 8.00),
('Aditya Kulkarni', 'CSE', 'aditya.k@gmail.com', '9876543220', 'Full Stack, MERN', 8.90),
('Pooja Iyer', 'DS', 'pooja.iyer@gmail.com', '9876543221', 'Python, Pandas, Visualization', 8.50),
('Manoj Kumar', 'ISE', 'manoj.k@gmail.com', '9876543222', 'Java, Microservices', 8.30),
('Aarav Shetty', 'CSE', 'aarav.s@gmail.com', '9876543223', 'Flask, React, PostgreSQL', 9.10),
('Diya Patel', 'AIML', 'diya.p@gmail.com', '9876543224', 'Computer Vision, TensorFlow', 8.75);

-- =========================================================
-- COMPANIES
-- =========================================================

INSERT INTO COMPANY (Company_Name, Location, HR_Email)
VALUES
('Google', 'Bangalore', 'careers@google.com'),
('Microsoft', 'Hyderabad', 'jobs@microsoft.com'),
('Amazon', 'Chennai', 'hiring@amazon.com'),
('Razorpay', 'Bangalore', 'careers@razorpay.com'),
('Swiggy', 'Bangalore', 'jobs@swiggy.com'),
('Zoho', 'Chennai', 'hr@zoho.com'),
('Infosys', 'Mysore', 'recruitment@infosys.com'),
('TCS', 'Hyderabad', 'careers@tcs.com');

-- =========================================================
-- FACULTY
-- =========================================================

INSERT INTO FACULTY (Name, Dept)
VALUES
('Dr. Ramesh Kumar', 'CSE'),
('Dr. Kavitha Rao', 'ISE'),
('Dr. Srinivas Murthy', 'ECE'),
('Dr. Meena Iyer', 'AIML');

-- =========================================================
-- INTERNSHIPS
-- =========================================================

INSERT INTO INTERNSHIP (Company_ID, Role, Duration, Stipend)
VALUES
(1, 'Backend Developer Intern', '6 Months', 45000),
(1, 'Frontend Developer Intern', '3 Months', 30000),
(2, 'Cloud Engineer Intern', '6 Months', 50000),
(2, 'Data Analyst Intern', '4 Months', 35000),
(3, 'Software Engineer Intern', '6 Months', 40000),
(3, 'DevOps Intern', '5 Months', 42000),
(4, 'Full Stack Developer Intern', '6 Months', 38000),
(4, 'AI/ML Intern', '4 Months', 45000),
(5, 'Frontend Engineer Intern', '3 Months', 28000),
(5, 'Backend Engineer Intern', '6 Months', 36000),
(6, 'Java Developer Intern', '5 Months', 32000),
(6, 'UI/UX Developer Intern', '3 Months', 25000),
(7, 'Data Science Intern', '6 Months', 30000),
(8, 'Software Testing Intern', '4 Months', 22000);

-- =========================================================
-- APPLICATIONS
-- =========================================================

INSERT INTO APPLICATION (Student_ID, Internship_ID, Status, Apply_Date)
VALUES
(1, 1, 'Applied', '2026-05-01'),
(1, 7, 'Interview', '2026-05-03'),
(2, 11, 'Selected', '2026-05-02'),
(2, 4, 'Interview', '2026-05-05'),
(3, 5, 'Rejected', '2026-05-04'),
(3, 14, 'Applied', '2026-05-07'),
(4, 1, 'Selected', '2026-05-02'),
(4, 10, 'Interview', '2026-05-08'),
(5, 8, 'Applied', '2026-05-06'),
(5, 13, 'Interview', '2026-05-09'),
(6, 8, 'Selected', '2026-05-04'),
(6, 3, 'Interview', '2026-05-10'),
(7, 4, 'Applied', '2026-05-11'),
(7, 13, 'Selected', '2026-05-12'),
(8, 2, 'Applied', '2026-05-01'),
(8, 7, 'Interview', '2026-05-06'),
(9, 6, 'Rejected', '2026-05-03'),
(9, 3, 'Applied', '2026-05-13'),
(10, 14, 'Applied', '2026-05-02'),
(11, 7, 'Selected', '2026-05-05'),
(11, 1, 'Interview', '2026-05-14'),
(12, 13, 'Applied', '2026-05-07'),
(12, 4, 'Interview', '2026-05-15'),
(13, 11, 'Rejected', '2026-05-08'),
(13, 5, 'Applied', '2026-05-16'),
(14, 1, 'Selected', '2026-05-10'),
(14, 2, 'Interview', '2026-05-17'),
(15, 8, 'Applied', '2026-05-11'),
(15, 3, 'Interview', '2026-05-18'),
(5, 5, 'Rejected', '2026-05-19');

-- =========================================================
-- REPORTS
-- =========================================================

INSERT INTO REPORT (Student_ID, Faculty_ID, File_Path, Submission_Date)
VALUES
(1, 1, 'uploads/backend_report_rahul.pdf', '2026-05-20'),
(2, 2, 'uploads/java_project_ananya.pdf', '2026-05-21'),
(4, 1, 'uploads/flask_api_priya.pdf', '2026-05-22'),
(6, 4, 'uploads/nlp_model_sneha.pdf', '2026-05-23'),
(11, 1, 'uploads/fullstack_project_aditya.pdf', '2026-05-24'),
(14, 1, 'uploads/react_flask_aarav.pdf', '2026-05-25');

-- =========================================================
-- SAMPLE UPDATE & DELETE QUERIES (EXAMPLES)
-- =========================================================

-- 1. Update student's CGPA or details
-- UPDATE STUDENT 
-- SET CGPA = 9.20, Skills = 'Python, React, Flask, Docker' 
-- WHERE Student_ID = 1;

-- 2. Update an application status
-- UPDATE APPLICATION 
-- SET Status = 'Selected' 
-- WHERE App_ID = 1;

-- 3. Delete a specific report file entry
-- DELETE FROM REPORT 
-- WHERE Report_ID = 6;

-- 4. Delete an application entry
-- DELETE FROM APPLICATION 
-- WHERE App_ID = 12;


