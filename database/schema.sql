CREATE DATABASE internship_portal;

USE internship_portal;

CREATE TABLE STUDENT (
    Student_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Dept VARCHAR(50) NOT NULL,
   Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(15),
    Skills TEXT,
    CGPA DECIMAL(3,2)
);
CREATE TABLE COMPANY (
    Company_ID INT PRIMARY KEY AUTO_INCREMENT,
    Company_Name VARCHAR(100) NOT NULL,
    Location VARCHAR(100),
    HR_Email VARCHAR(100) UNIQUE
);

CREATE TABLE FACULTY (
    Faculty_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Dept VARCHAR(50)
);
CREATE TABLE INTERNSHIP (
    Internship_ID INT PRIMARY KEY AUTO_INCREMENT,
    Company_ID INT,
    Role VARCHAR(100) NOT NULL,
    Duration VARCHAR(50),
    Stipend DECIMAL(10,2),

    FOREIGN KEY (Company_ID)
    REFERENCES COMPANY(Company_ID)
);
CREATE TABLE APPLICATION (
    App_ID INT PRIMARY KEY AUTO_INCREMENT,
    Student_ID INT,
    Internship_ID INT,
    Status VARCHAR(20) CHECK (
        Status IN ('Applied', 'Interview', 'Selected', 'Rejected')
    ),
    Apply_Date DATE,

    FOREIGN KEY (Student_ID)
    REFERENCES STUDENT(Student_ID),

    FOREIGN KEY (Internship_ID)
    REFERENCES INTERNSHIP(Internship_ID)
);
CREATE TABLE REPORT (
    Report_ID INT PRIMARY KEY AUTO_INCREMENT,
    Student_ID INT,
    Faculty_ID INT,
    File_Path VARCHAR(255),
    Submission_Date DATE,

    FOREIGN KEY (Student_ID)
    REFERENCES STUDENT(Student_ID),

    FOREIGN KEY (Faculty_ID)
    REFERENCES FACULTY(Faculty_ID)
);

-- ================================================================
-- VIEW: student_application_view
-- Purpose: Provide a readable, joined view that combines student,
-- internship, company and application status information. Useful
-- for reporting, admin dashboards, and quick queries without
-- repeating JOIN logic in application code.
-- Fields exposed:
--   - Student_ID
--   - Student_Name
--   - Internship_Role
--   - Company_Name
--   - Application_Status
--   - Apply_Date
-- ================================================================
CREATE OR REPLACE VIEW student_application_view AS
SELECT
    s.Student_ID,
    s.Name AS Student_Name,
    i.Role AS Internship_Role,
    c.Company_Name AS Company_Name,
    a.Status AS Application_Status,
    a.Apply_Date
FROM APPLICATION a
JOIN STUDENT s ON a.Student_ID = s.Student_ID
JOIN INTERNSHIP i ON a.Internship_ID = i.Internship_ID
JOIN COMPANY c ON i.Company_ID = c.Company_ID;

-- ================================================================
-- TRIGGER: prevent_invalid_cgpa
-- Purpose: Validate CGPA on student insertion. Rejects inserts
-- where CGPA is outside the valid range (0.00 - 10.00). This
-- provides a simple, centralized integrity check at the DB layer
-- and complements application-side validation.
-- Uses SIGNAL SQLSTATE '45000' to abort the insert with a
-- readable error message.
-- ================================================================
DELIMITER $$
CREATE TRIGGER prevent_invalid_cgpa
BEFORE INSERT ON STUDENT
FOR EACH ROW
BEGIN
    -- If CGPA provided and is outside allowed range, reject insert
    IF NEW.CGPA IS NOT NULL AND (NEW.CGPA < 0 OR NEW.CGPA > 10) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid CGPA value';
    END IF;
END$$
DELIMITER ;

-- ================================================================
-- Note on assertions/integrity
-- MySQL does not fully support CREATE ASSERTION. Integrity is
-- enforced using a combination of:
--   - Foreign key constraints (referential integrity)
--   - CHECK constraints where supported
--   - Triggers for business-rule validation (like the above)
-- ================================================================