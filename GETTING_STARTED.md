# 🚀 Getting Started - Élégance Moderne

A complete guide to set up and run the Élégance Moderne e-commerce platform on your local machine.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Database Seeding](#database-seeding)
- [Accessing the Application](#accessing-the-application)
- [Default Credentials](#default-credentials)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Tech Stack](#tech-stack)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Required Software

- **Docker Desktop** (v20.10+)
  - [Download for Windows](https://www.docker.com/products/docker-desktop/)
  - [Download for Mac](https://www.docker.com/products/docker-desktop/)
  - [Download for Linux](https://docs.docker.com/engine/install/)

- **Git** (v2.30+)
  - [Download Git](https://git-scm.com/downloads)

- **VS Code** (recommended)
  - [Download VS Code](https://code.visualstudio.com/)

### System Requirements

- **RAM:** Minimum 8GB (16GB recommended)
- **Disk Space:** At least 5GB free
- **OS:** Windows 10/11, macOS 10.15+, or Linux

---

## ⚡ Quick Start

For experienced developers who want to get started immediately:

```bash
# 1. Clone the repository
git clone <repository-url>
cd MMA

# 2. Start all services with Docker
docker-compose up -d

# 3. Wait for services to be ready (30-60 seconds)
# Check status: docker-compose ps

# 4. Run database migrations
docker-compose exec backend python manage.py migrate

# 5. Create admin user
docker-compose exec backend python manage.py createsuperuser

# 6. Seed database with sample data
docker-compose exec backend python manage.py seed_wilayas backend/worldcities.csv
docker-compose exec backend python manage.py seed_products

# 7. Access the application
# Frontend: http://localhost:3000
# Admin: http://localhost:3000/admin
# Backend API: http://localhost:8000/api/v1
```

---

## 📖 Detailed Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd MMA
```

### Step 2: Verify Docker Installation

Make sure Docker Desktop is running:

```bash
docker --version
docker-compose --version
```

You should see version numbers for both commands.

### Step 3: Review Configuration Files

The project includes pre-configured files:

- `docker-compose.yml` - Defines all services (frontend, backend, database, SonarQube)
- `.env.example` - Environment variables template (auto-generated on first run)

### Step 4: Start Docker Services

Start all containers in detached mode:

```bash
docker-compose up -d
```

This will:
- Pull necessary Docker images (first time only)
- Build the frontend and backend containers
- Start MySQL database
- Start SonarQube (optional)
- Start the Next.js frontend
- Start the Django backend

**Expected Output:**
```
Creating network "mma_default" with the default driver
Creating mma_db       ... done
Creating mma_backend  ... done
Creating mma_frontend ... done
Creating mma_sonarqube ... done
```

### Step 5: Verify Services are Running

Check the status of all services:

```bash
docker-compose ps
```

All services should show "Up" status. Wait 30-60 seconds for services to fully initialize.

### Step 6: Database Setup

#### 6.1 Run Migrations

Apply Django database migrations:

```bash
docker-compose exec backend python manage.py migrate
```

**Expected Output:**
```
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
  Applying store.0001_initial... OK
```

#### 6.2 Create Admin User

Create a Django admin superuser:

```bash
docker-compose exec backend python manage.py createsuperuser
```

**You'll be prompted for:**
- Username (e.g., `admin`)
- Email (optional)
- Password (minimum 8 characters)

**Note:** Remember these credentials - you'll need them for the admin dashboard!

### Step 7: Seed Sample Data

#### 7.1 Seed Algerian Locations (Wilayas & Baladiyas)

First, ensure the CSV file is accessible in the container:

```bash
# Copy CSV to container if not already there
docker cp backend/worldcities.csv mma_backend:/tmp/worldcities.csv

# Run seeding command
docker-compose exec backend python manage.py seed_wilayas /tmp/worldcities.csv
```

**Expected Output:**
```
Successfully created 58 wilayas and 553 baladiyas
```

#### 7.2 Seed Products and Categories

```bash
docker-compose exec backend python manage.py seed_products
```

**Expected Output:**
```
✅ Seeding completed successfully!
   Categories: 12
   Products: 15
   Variants: 53
```

This creates:
- 3 parent categories (Femmes, Hommes, Accessoires)
- 9 subcategories (Robes, Chemises, Sacs, etc.)
- 15 products with real images
- 53 product variants (different sizes/colors)

---

## 🌐 Accessing the Application

Once all services are running and data is seeded:

### Public Website
- **URL:** http://localhost:3000
- **Features:**
  - Browse products and categories
  - Search functionality
  - Add to cart
  - Guest checkout (no login required)
  - View order confirmation

### Admin Dashboard
- **URL:** http://localhost:3000/admin
- **Login:** Use the credentials you created with `createsuperuser`
- **Features:**
  - Manage products (CRUD)
  - Manage categories
  - Create product variants (bulk creation supported)
  - View and manage orders
  - CSV import/export
  - Audit logs

### Backend API
- **Base URL:** http://localhost:8000/api/v1
- **API Documentation:** http://localhost:8000/swagger/
- **Admin Panel:** http://localhost:8000/admin/

### Database
- **Host:** localhost
- **Port:** 3307 (mapped from 3306 in container)
- **Database:** `clothes_store`
- **Username:** `store_user`
- **Password:** `secret`
- **Tool:** Use MySQL Workbench or any MySQL client

### SonarQube (Code Quality)
- **URL:** http://localhost:9000
- **Default Credentials:**
  - Username: `admin`
  - Password: `admin` (change on first login)

---

## 🔑 Default Credentials

### Admin Dashboard
- **Username:** (what you set during `createsuperuser`)
- **Password:** (what you set during `createsuperuser`)

### Django Admin API Token
Generate a token for API access:

```bash
docker-compose exec backend python manage.py shell -c "from rest_framework.authtoken.models import Token; from django.contrib.auth.models import User; user = User.objects.first(); token, _ = Token.objects.get_or_create(user=user); print(f'Token: {token.key}')"
```

---

## 📁 Project Structure

```
MMA/
├── backend/                    # Django REST API
│   ├── app/                   # Main Django project
│   │   ├── settings.py       # Django settings
│   │   └── urls.py           # Main URL configuration
│   ├── store/                # Store app
│   │   ├── models.py         # Database models
│   │   ├── views.py          # API views
│   │   ├── serializers.py    # DRF serializers
│   │   ├── urls.py           # Store URLs
│   │   └── management/       # Custom management commands
│   │       └── commands/
│   │           ├── seed_products.py
│   │           └── seed_wilayas.py
│   ├── Dockerfile            # Backend Docker config
│   ├── requirements.txt      # Python dependencies
│   └── manage.py             # Django management script
│
├── frontend/                  # Next.js Application
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── collections/ # Collections & categories
│   │   │   ├── product/     # Product detail pages
│   │   │   ├── cart/        # Shopping cart
│   │   │   ├── checkout/    # Checkout page
│   │   │   ├── search/      # Search page
│   │   │   └── admin/       # Admin dashboard
│   │   ├── components/       # Reusable React components
│   │   └── lib/             # Utilities and API client
│   ├── Dockerfile           # Frontend Docker config
│   ├── package.json         # Node dependencies
│   └── next.config.js       # Next.js configuration
│
├── docker-compose.yml        # Docker services configuration
├── .gitignore               # Git ignore rules
├── README.md                # Project overview
└── GETTING_STARTED.md       # This file
```

---

## 💻 Development Workflow

### Viewing Logs

View logs for all services:
```bash
docker-compose logs -f
```

View logs for a specific service:
```bash
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db
```

### Restarting Services

Restart all services:
```bash
docker-compose restart
```

Restart a specific service:
```bash
docker-compose restart frontend
docker-compose restart backend
```

### Stopping Services

Stop all services:
```bash
docker-compose down
```

Stop and remove volumes (⚠️ **This deletes all data**):
```bash
docker-compose down -v
```

### Making Code Changes

#### Frontend Changes
- Edit files in `frontend/src/`
- Hot reload is enabled - changes appear automatically
- If changes don't appear, restart: `docker-compose restart frontend`

#### Backend Changes
- Edit files in `backend/`
- Django auto-reloads on file changes
- For model changes, run migrations:
  ```bash
  docker-compose exec backend python manage.py makemigrations
  docker-compose exec backend python manage.py migrate
  ```

### Accessing Container Shell

Backend (Django):
```bash
docker-compose exec backend bash
```

Frontend (Next.js):
```bash
docker-compose exec frontend sh
```

Database (MySQL):
```bash
docker-compose exec db mysql -u store_user -psecret clothes_store
```

### Running Django Management Commands

```bash
# General format
docker-compose exec backend python manage.py <command>

# Examples
docker-compose exec backend python manage.py shell
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

### Installing New Dependencies

**Backend (Python):**
```bash
# Add package to backend/requirements.txt
# Then rebuild
docker-compose exec backend pip install <package-name>
# Or rebuild container
docker-compose up -d --build backend
```

**Frontend (Node.js):**
```bash
# Add package
docker-compose exec frontend npm install <package-name>
# Or rebuild container
docker-compose up -d --build frontend
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Problem:** `Error: port is already allocated`

**Solution:**
```bash
# Check what's using the port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Mac/Linux

# Stop the process or change port in docker-compose.yml
```

### Services Not Starting

**Problem:** Containers exit immediately

**Solution:**
```bash
# Check logs for errors
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

### Database Connection Errors

**Problem:** `Can't connect to MySQL server`

**Solution:**
```bash
# Wait for database to be fully ready (can take 30-60 seconds)
docker-compose exec db mysql -u store_user -psecret -e "SELECT 1"

# If still failing, restart database
docker-compose restart db
```

### Frontend Not Loading

**Problem:** Blank page or errors at http://localhost:3000

**Solution:**
```bash
# Check frontend logs
docker-compose logs frontend

# Clear Next.js cache and rebuild
docker-compose exec frontend rm -rf .next
docker-compose restart frontend
```

### Images Not Loading

**Problem:** Product images not displaying

**Solution:**
- Images use Unsplash URLs - ensure internet connection
- Check browser console for CORS errors
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Admin Dashboard - Can't Login

**Problem:** Invalid credentials

**Solution:**
```bash
# Create new superuser
docker-compose exec backend python manage.py createsuperuser

# Or reset existing user password
docker-compose exec backend python manage.py shell
>>> from django.contrib.auth.models import User
>>> user = User.objects.get(username='admin')
>>> user.set_password('newpassword')
>>> user.save()
>>> exit()
```

### Docker Out of Memory

**Problem:** Services crashing or slow performance

**Solution:**
1. Open Docker Desktop
2. Go to Settings > Resources
3. Increase Memory to at least 4GB
4. Click "Apply & Restart"

### Clear Everything and Start Fresh

If you want to completely reset:

```bash
# Stop all services
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build

# Re-run migrations and seeding
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py seed_products
```

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **API Client:** Axios
- **Forms:** React Hook Form

### Backend
- **Framework:** Django 4.2
- **API:** Django REST Framework
- **Database:** MySQL 8
- **Authentication:** Token-based (DRF)

### DevOps
- **Containerization:** Docker + Docker Compose
- **Code Quality:** SonarQube
- **CI/CD:** GitHub Actions (configured)

---

## 📝 Additional Resources

### Documentation
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Useful Commands Cheat Sheet

```bash
# Docker
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose ps                 # Check service status
docker-compose logs -f <service>  # View logs
docker-compose restart <service>  # Restart a service

# Backend (Django)
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py shell
docker-compose exec backend python manage.py seed_products

# Frontend
docker-compose exec frontend npm install <package>
docker-compose exec frontend npm run build
docker-compose exec frontend sh

# Database
docker-compose exec db mysql -u store_user -psecret clothes_store
```

---

## 🤝 Need Help?

If you encounter issues not covered in this guide:

1. Check the logs: `docker-compose logs -f`
2. Search existing issues in the repository
3. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Error messages/logs
   - Your OS and Docker version

---

## ✅ Verification Checklist

Before considering setup complete, verify:

- [ ] All Docker containers are running (`docker-compose ps`)
- [ ] Frontend loads at http://localhost:3000
- [ ] Products are visible on the homepage
- [ ] Can navigate to product detail pages
- [ ] Can add products to cart
- [ ] Can access admin dashboard at http://localhost:3000/admin
- [ ] Can login to admin with your credentials
- [ ] Backend API responds at http://localhost:8000/api/v1/products/
- [ ] Database contains seeded data (12 categories, 15 products)

---

**Happy Coding! 🎉**

For more information, see the main [README.md](README.md) file.

