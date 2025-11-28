# Credentials and Access Guide

## How to Get Credentials

### 1. Django Admin (http://localhost:8000/admin)

**Create a superuser account:**

```bash
docker-compose exec backend python manage.py createsuperuser
```

You'll be prompted to enter:
- Username (e.g., `admin`)
- Email (optional, e.g., `admin@example.com`)
- Password (choose a strong password)

**Then login at:** http://localhost:8000/admin

---

### 2. Admin Dashboard (http://localhost:3000/admin)

The admin dashboard uses **Django REST Framework Token Authentication**.

**Step 1: Get your token**

After creating a superuser, get your authentication token:

```bash
# Option A: Using Django shell
docker-compose exec backend python manage.py shell
```

Then in the shell:
```python
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

user = User.objects.get(username='admin')  # or your username
token, created = Token.objects.get_or_create(user=user)
print(f"Your token: {token.key}")
exit()
```

**Step 2: Login via API**

Or use the API endpoint to get a token:

```bash
# Using curl (replace admin/admin123 with your credentials)
curl -X POST http://localhost:8000/api-token-auth/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

This will return:
```json
{"token": "your-token-here"}
```

**Step 3: Login in Admin Dashboard**

1. Go to http://localhost:3000/admin
2. Enter your Django username and password
3. The frontend will automatically get the token and store it

**Note:** The admin dashboard login uses the same credentials as Django admin.

---

### 3. SonarQube (http://localhost:9000)

**Default credentials:**
- Username: `admin`
- Password: `admin`

**First login:**
1. Go to http://localhost:9000
2. Login with `admin` / `admin`
3. You'll be prompted to change the password (recommended)

**Generate a token for CI/CD:**

1. Login to SonarQube
2. Go to: **My Account** → **Security** → **Generate Token**
3. Name it (e.g., "CI-CD")
4. Copy the token
5. Add it to your `.env` file:
   ```env
   SONAR_TOKEN=your-generated-token-here
   ```

---

## Quick Setup Commands

### Create Django Superuser
```bash
docker-compose exec backend python manage.py createsuperuser
```

### Get API Token for Admin Dashboard
```bash
docker-compose exec backend python manage.py shell
```
Then run:
```python
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
user = User.objects.get(username='admin')
token, created = Token.objects.get_or_create(user=user)
print(token.key)
```

### Check if services are running
```bash
docker-compose ps
```

### View logs if something isn't working
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

---

## Troubleshooting

### "Cannot connect to API"
- Make sure backend is running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify API URL in `.env`: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`

### "Admin login not working"
- Make sure you created a superuser first
- Check if token was generated: `docker-compose exec backend python manage.py shell` then check Token.objects.all()

### "SonarQube not accessible"
- Wait 1-2 minutes after starting containers (SonarQube takes time to initialize)
- Check logs: `docker-compose logs sonarqube`
- Default credentials: admin/admin

