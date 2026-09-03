import urllib.request
import json

def test_login(username, password):
    url = 'http://127.0.0.1:8000/api/auth/login'
    data = json.dumps({'username': username, 'password': password}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read().decode())
            print(f'SUCCESS for "{username}" with "{password}": token received, user: {body.get("user", {}).get("username")}')
    except urllib.error.HTTPError as e:
        print(f'FAILED for "{username}" with "{password}": {e.code} {e.read().decode()}')

if __name__ == '__main__':
    test_login('student1', 'demo1234')
    test_login('student1', 'password123')
    test_login('nithesh kumar', 'demo1234')
    test_login('nithesh', 'password123')
