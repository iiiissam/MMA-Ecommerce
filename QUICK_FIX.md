# Quick Fix for Port 3306 Error

## Problem
Port 3306 is already in use by another MySQL instance on your computer.

## Solution Options

### Option 1: Use Different Port (Recommended)
I've updated `docker-compose.yml` to use port **3307** instead of 3306.

**If you need to connect from outside Docker**, update your `.env` file:
```env
MYSQL_PORT=3307
```

**Note:** Inside Docker containers, they still use port 3306 to communicate with each other. Only the external port changed.

### Option 2: Stop Local MySQL Service
If you have MySQL installed locally and want to use port 3306:

1. Open Services (Win+R → `services.msc`)
2. Find "MySQL" or "MySQL80" service
3. Right-click → Stop
4. Change docker-compose.yml back to port 3306

### Option 3: Change MySQL Port in docker-compose.yml
You can change to any available port:
```yaml
ports:
  - "3308:3306"  # Use 3308 externally, 3306 internally
```

## After Fixing

1. Stop any running containers:
   ```bash
   docker-compose down
   ```

2. Start again:
   ```bash
   docker-compose up -d
   ```

3. Check if services are running:
   ```bash
   docker-compose ps
   ```

4. Check logs if issues persist:
   ```bash
   docker-compose logs db
   docker-compose logs backend
   ```

