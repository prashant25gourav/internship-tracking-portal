import requests
try:
    r = requests.get('http://127.0.0.1:5000/students')
    data = r.json().get('data', [])
    if data:
        print("Student email to test:", data[0]['Email'])
except Exception as e:
    print(e)
