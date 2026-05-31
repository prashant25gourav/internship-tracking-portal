import requests
import os
url = 'http://127.0.0.1:5000/upload-report'
# Compute absolute path relative to this script
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
file_path = os.path.join(root, 'uploads', '20260527124820_Assignment-Problem.pdf')
with open(file_path, 'rb') as f:
    files = {'file': ('test.pdf', f, 'application/pdf')}
    data = {'student_id': '17'}
    r = requests.post(url, files=files, data=data)
    print(r.status_code)
    print(r.text)
