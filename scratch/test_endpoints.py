import requests
import json
import uuid

BASE_URL = "http://127.0.0.1:5000"

def test_api():
    print("Testing GET /internships")
    try:
        r = requests.get(f"{BASE_URL}/internships")
        print("Status:", r.status_code)
        print("Response:", r.json())
    except Exception as e:
        print("Error:", e)

    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    print(f"\nTesting POST /register-student with {unique_email}")
    try:
        r = requests.post(f"{BASE_URL}/register-student", json={
            "name": "Test Student",
            "dept": "Computer Science",
            "email": unique_email,
            "phone": "1234567890",
            "skills": "Python, React",
            "cgpa": "8.5"
        })
        print("Status:", r.status_code)
        print("Response:", r.json())
    except Exception as e:
        print("Error:", e)

    print(f"\nTesting POST /login-student")
    try:
        r = requests.post(f"{BASE_URL}/login-student", json={
            "email": unique_email
        })
        print("Status:", r.status_code)
        print("Response:", r.json())
        student_id = r.json().get('data', {}).get('student', {}).get('Student_ID')
    except Exception as e:
        print("Error:", e)
        student_id = None

    if student_id:
        print(f"\nTesting POST /apply")
        try:
            r = requests.post(f"{BASE_URL}/apply", json={
                "student_id": student_id,
                "internship_id": 1
            })
            print("Status:", r.status_code)
            print("Response:", r.json())
        except Exception as e:
            print("Error:", e)
    
    print("\nTesting POST /auth/token (Admin Login)")
    try:
        r = requests.post(f"{BASE_URL}/auth/token", json={
            "password": "change_me"
        })
        print("Status:", r.status_code)
        print("Response:", r.json())
        token = r.json().get('data', {}).get('token')
    except Exception as e:
        print("Error:", e)
        token = None

    if token:
        print("\nTesting GET /analytics/summary")
        try:
            r = requests.get(f"{BASE_URL}/analytics/summary", headers={"Authorization": f"Bearer {token}"})
            print("Status:", r.status_code)
            print("Response:", r.json())
        except Exception as e:
            print("Error:", e)

if __name__ == '__main__':
    test_api()
