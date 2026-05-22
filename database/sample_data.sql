INSERT INTO STUDENT (Name, Dept, Email, Phone, Skills, CGPA)
VALUES
('Rahul Sharma', 'CSE', 'rahul@gmail.com', '9876543210', 'Python, React', 8.5),

('Ananya Singh', 'ISE', 'ananya@gmail.com', '9876543211', 'Java, SQL', 8.9),

('Arjun Verma', 'ECE', 'arjun@gmail.com', '9876543212', 'C++, Embedded Systems', 8.1),

('Priya Nair', 'CSE', 'priya@gmail.com', '9876543213', 'Flask, MySQL', 9.0),

('Karan Mehta', 'AIML', 'karan@gmail.com', '9876543214', 'Machine Learning, Python', 8.7);

INSERT INTO COMPANY (Company_Name, Location, HR_Email)
VALUES
('Google', 'Bangalore', 'hr@google.com'),

('Infosys', 'Mysore', 'careers@infosys.com'),

('TCS', 'Hyderabad', 'jobs@tcs.com'),

('Amazon', 'Chennai', 'hr@amazon.com');

INSERT INTO FACULTY (Name, Dept)
VALUES
('Dr. Ramesh', 'CSE'),

('Dr. Kavitha', 'ISE'),

('Dr. Srinivas', 'ECE');

INSERT INTO INTERNSHIP (Company_ID, Role, Duration, Stipend)
VALUES
(1, 'Frontend Developer', '3 Months', 25000),

(1, 'Backend Developer', '6 Months', 40000),

(2, 'Data Analyst', '4 Months', 20000),

(3, 'Software Engineer Intern', '6 Months', 30000),

(4, 'ML Intern', '5 Months', 35000);

INSERT INTO APPLICATION (Student_ID, Internship_ID, Status, Apply_Date)
VALUES
(1, 1, 'Applied', '2026-05-01'),

(2, 3, 'Interview', '2026-05-02'),

(3, 4, 'Selected', '2026-05-03'),

(4, 2, 'Applied', '2026-05-04'),

(5, 5, 'Rejected', '2026-05-05');

INSERT INTO REPORT (Student_ID, Faculty_ID, File_Path, Submission_Date)
VALUES
(1, 1, 'uploads/report1.pdf', '2026-05-10'),

(2, 2, 'uploads/report2.pdf', '2026-05-11'),

(3, 3, 'uploads/report3.pdf', '2026-05-12');