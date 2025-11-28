# Troubleshooting Guide

## Docker Issues

### Error: "request returned 500 Internal Server Error for API route"

This error means Docker Desktop is not running properly. Try these steps:

1. **Check if Docker Desktop is running**
   - Look for Docker Desktop icon in system tray
   - If not running, start Docker Desktop
   - Wait for it to fully start (whale icon should be steady, not animated)

2. **Restart Docker Desktop**
   - Right-click Docker Desktop icon → Quit Docker Desktop
   - Wait 10 seconds
   - Start Docker Desktop again
   - Wait for it to fully initialize

3. **Check Docker version**
   ```bash
   docker --version
   docker-compose --version
   ```

4. **Test Docker connection**
   ```bash
   docker ps
   ```
   If this fails, Docker Desktop is not running properly.

5. **Restart Docker Desktop Service (if needed)**
   - Open Services (Win+R → services.msc)
   - Find "Docker Desktop Service"
   - Right-click → Restart

### Error: "unable to get image"

This usually means:
- Docker Desktop is not running
- Docker daemon is not responding
- Try restarting Docker Desktop

## MySQL Connection Issues

### Important: MySQL Host in Docker

When using Docker Compose, the MySQL host should be `db` (the service name), NOT `localhost`.

**Correct for Docker:**
```env
MYSQL_HOST=db
```

**Wrong (will not work in Docker):**
```env
MYSQL_HOST=localhost
```

The containers communicate using service names defined in `docker-compose.yml`.

## Common Issues

### 1. Port Already in Use

If you get "port already in use" errors:

```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :3306

# Stop the process or change ports in docker-compose.yml
```

### 2. Container Won't Start

```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Restart specific service
docker-compose restart backend
```

### 3. Database Migration Fails

```bash
# Make sure database is ready
docker-compose exec db mysqladmin ping -h localhost

# Run migrations manually
docker-compose exec backend python manage.py migrate
```

### 4. Permission Issues (Linux/Mac)

If you get permission errors:
```bash
sudo chown -R $USER:$USER .
```

## Manual Setup (if Docker fails)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### MySQL Setup (if not using Docker)

1. Install MySQL 8
2. Create database: `CREATE DATABASE clothes_store;`
3. Update `.env` with your MySQL credentials
4. Make sure `MYSQL_HOST=localhost` (not `db`)

## Getting Help

1. Check Docker Desktop is running
2. Check container logs: `docker-compose logs`
3. Verify `.env` file exists and has correct values
4. Try restarting Docker Desktop
5. Check if ports 3000, 8000, 3306 are available


