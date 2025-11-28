#!/bin/bash

# Setup script for Clothes Store E-commerce Application

echo "🚀 Setting up Clothes Store E-commerce Application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists."
fi

# Build and start containers
echo "🐳 Building Docker containers..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations
echo "📊 Running database migrations..."
docker-compose exec -T backend python manage.py migrate

# Create superuser (optional)
echo "👤 Would you like to create a superuser? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    docker-compose exec backend python manage.py createsuperuser
fi

echo "✅ Setup complete!"
echo ""
echo "📍 Access points:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000/api/v1"
echo "   - Admin Dashboard: http://localhost:3000/admin"
echo "   - API Docs: http://localhost:8000/api/docs"
echo "   - Django Admin: http://localhost:8000/admin"
echo "   - SonarQube: http://localhost:9000"
echo ""
echo "📚 See README.md for more information."

