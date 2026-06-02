import requests

files = {'file': ('test.pdf', b'%PDF-1.4\n%EOF', 'application/pdf')}
data = {
    'student_id': 1,
    'title': 'Test Title'
}

r = requests.post("http://127.0.0.1:5000/upload-report", files=files, data=data)
print("Status:", r.status_code)
try:
    print("Response:", r.json())
except:
    print("Response:", r.text)
