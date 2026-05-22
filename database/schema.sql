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