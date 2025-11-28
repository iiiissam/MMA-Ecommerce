# Running Backend Locally (Without Docker)

## Prerequisites

**Important:** This project requires **Python 3.11** (not 3.12).

Django 4.2.7 doesn't fully support Python 3.12. You need Python 3.11.

### Check Your Python Version

```bash
python --version
```

If you see Python 3.12, you need to install Python 3.11.

## Setup Steps

### 1. Install Python 3.11

- Download from: https://www.python.org/downloads/release/python-3110/
- Or use pyenv (recommended for managing multiple Python versions)

### 2. Create Virtual Environment

```bash
cd backend
python3.11 -m venv venv
```

On Windows:
```bash
cd backend
py -3.11 -m venv venv
```

### 3. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Setup Database

You need MySQL running locally. Update `.env` or create `backend/.env`:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=clothes_store
MYSQL_USER=root
MYSQL_PASSWORD=your_password
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

### 6. Run Migrations

```bash
python manage.py migrate
```

### 7. Create Superuser

```bash
python manage.py createsuperuser
```

### 8. Run Development Server

```bash
python manage.py runserver
```

The backend will be available at: http://localhost:8000

## Alternative: Use Docker (Recommended)

If you're having Python version issues, it's easier to use Docker:

```bash
docker-compose up backend
```

This ensures the correct Python version (3.11) is used.

## Troubleshooting

### Error: "AttributeError: module 'django.db.backends.base' has no attribute 'DatabaseWrapper'"

This means you're using Python 3.12. You need Python 3.11.

### Error: "No module named 'mysqlclient'"

Install MySQL client libraries:

**Windows:**
- Download MySQL Connector/C from MySQL website
- Or use: `pip install mysqlclient` (may need Visual C++ Build Tools)

**Linux:**
```bash
sudo apt-get install default-libmysqlclient-dev
pip install mysqlclient
```

**Mac:**
```bash
brew install mysql
pip install mysqlclient
```

### Error: "Can't connect to MySQL"

1. Make sure MySQL is running
2. Check your `.env` file has correct credentials
3. Verify MySQL is accessible:
   ```bash
   mysql -u root -p -h localhost
   ```

