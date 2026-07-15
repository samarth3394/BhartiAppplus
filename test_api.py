import asyncio
from fastapi.testclient import TestClient
from main import app
from models import User
from dependencies import get_db

client = TestClient(app)

# Login first to get the cookie
response = client.post("/api/auth/login", json={"email": "samarth.n1@gmail.com", "password": "password"})
print("Login:", response.status_code, response.cookies)

response = client.post("/api/apps", json={
    "name": "API Test App",
    "workspace_id": "cc2e396c-3f5d-4eee-857b-617c1098985c"
})
print("Create App:", response.status_code, response.json())
