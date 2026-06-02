import requests

r = requests.get("http://127.0.0.1:5000/reports")
print("All Reports:", r.json())

r2 = requests.get("http://127.0.0.1:5000/reports/1/download")
print("\nDownload Status:", r2.status_code)
if r2.status_code != 200:
    try:
        print("Response:", r2.json())
    except:
        print("Response:", r2.text)
