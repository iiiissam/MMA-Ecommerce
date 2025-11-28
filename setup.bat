@echo off
REM Setup script for Clothes Store E-commerce Application (Windows)

echo Setting up Clothes Store E-commerce Application...

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env.example (
    echo Warning: .env.example not found. Creating a basic .env file...
    (
          echo # MySQL Database
          echo MYSQL_HOST=db
          echo MYSQL_PORT=3306
          echo MYSQL_DATABASE=clothes_store
          echo MYSQL_USER=store_user
          echo MYSQL_PASSWORD=secret_password_123
          echo MYSQL_ROOT_PASSWORD=root_password_123
        echo.
        echo # Django
        echo DJANGO_SECRET_KEY=kjfdhgkhdklsfglkjfghdkljghdkljsfhgkjldshflkjghdkljshfglkjh
        echo DJANGO_DEBUG=1
        echo DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend
        echo.
        echo # API
        echo NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
        echo NEXT_PUBLIC_SITE_NAME=Clothes Store
        echo NEXT_PUBLIC_CURRENCY=DZD
    ) > .env
    echo .env file created in the project root directory.
) else if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env >nul
    echo .env file created in the project root directory. Please update it with your configuration.
) else (
    echo .env file already exists in the project root directory.
)

REM Build and start containers
echo Building Docker containers...
docker-compose build

echo Starting services...
docker-compose up -d

REM Wait for database to be ready
echo Waiting for database to be ready...
echo (This may take 30-60 seconds for MySQL to fully start...)
timeout /t 30 /nobreak >nul

REM Run migrations
echo Running database migrations...
docker-compose exec -T backend python manage.py migrate

echo Setup complete!
echo.
echo Access points:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:8000/api/v1
echo    - Admin Dashboard: http://localhost:3000/admin
echo    - API Docs: http://localhost:8000/api/docs
echo    - Django Admin: http://localhost:8000/admin
echo    - SonarQube: http://localhost:9000
echo.
echo See README.md for more information.

