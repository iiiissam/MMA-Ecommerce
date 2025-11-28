# Mini e-commerce vêtements

A full-stack e-commerce application for clothing with a public storefront (guest checkout) and an admin dashboard for managing products, orders, and inventory.

## Tech Stack

- **Frontend**: Next.js 14+ (TypeScript, React, Tailwind CSS)
- **Backend**: Django 4+ with Django REST Framework
- **Database**: MySQL 8+
- **DevOps**: Docker, Docker Compose, GitHub Actions
- **Code Quality**: ESLint, Prettier, Flake8, Black, SonarQube

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd MMA
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start the application:
```bash
docker-compose up -d
```

4. Run migrations:
```bash
docker-compose exec backend python manage.py migrate
```

5. Create a superuser (for admin access):
```bash
docker-compose exec backend python manage.py createsuperuser
```

6. Load sample data (optional):
```bash
docker-compose exec backend python manage.py loaddata fixtures/sample_data.json
```

### Access Points

- **Public Storefront**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Backend API**: http://localhost:8000/api/v1
- **API Documentation**: http://localhost:8000/api/docs
- **Django Admin**: http://localhost:8000/admin
- **SonarQube**: http://localhost:9000 (default login: admin/admin)

## Project Structure

```
MMA/
├── backend/              # Django REST API
│   ├── app/
│   │   ├── models.py     # Data models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/            # Next.js public storefront
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   └── Dockerfile
├── admin/               # Next.js admin dashboard (optional separate app)
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml
└── docs/
    ├── architecture.md
    ├── api-spec.yaml
    └── er-diagram.md
```

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `MYSQL_HOST`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
- `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`
- `NEXT_PUBLIC_API_URL`
- `SONAR_TOKEN` (for CI/CD)

## Development

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Testing

### Run all tests:
```bash
docker-compose exec backend pytest
docker-compose exec frontend npm test
```

### Run with coverage:
```bash
docker-compose exec backend pytest --cov=app --cov-report=html
docker-compose exec frontend npm test -- --coverage
```

### E2E Tests:
```bash
docker-compose exec frontend npm run test:e2e
```

## API Documentation

API documentation is available at:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

OpenAPI specification: `docs/api-spec.yaml`

## Deployment

See `docs/deployment.md` for detailed deployment instructions.

## Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature branches

## CI/CD Pipeline

The GitHub Actions pipeline runs on every PR and push:
1. Linting (ESLint, Flake8, Black)
2. Unit tests with coverage
3. SonarQube analysis
4. Build verification

## License

MIT

## Contributors

See CONTRIBUTORS.md

