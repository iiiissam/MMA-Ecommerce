# Project Summary: Mini e-commerce vêtements

## Overview

This is a production-ready full-stack e-commerce application for clothing with a public storefront (guest checkout) and an admin dashboard for managing products, orders, and inventory.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: Axios + SWR
- **Forms**: React Hook Form
- **Testing**: Jest + React Testing Library, Cypress

### Backend
- **Framework**: Django 4.2 + Django REST Framework
- **Language**: Python 3.11
- **Database**: MySQL 8
- **Testing**: pytest + pytest-django
- **Code Quality**: Black, Flake8, isort

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Code Quality**: SonarQube/SonarCloud
- **Version Control**: Git (main, develop, feature/*)

## Project Structure

```
MMA/
├── backend/              # Django REST API
│   ├── app/              # Django project settings
│   ├── store/            # Store app (models, views, serializers)
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/             # Next.js public storefront
│   ├── src/
│   │   ├── app/         # Next.js pages
│   │   ├── components/  # React components
│   │   └── lib/         # Utilities and API client
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml    # Local development setup
├── .github/workflows/   # CI/CD pipelines
├── docs/                # Documentation
└── README.md
```

## Key Features

### Public Storefront
- ✅ Homepage with featured products
- ✅ Product listing with filters (category, price, size, color)
- ✅ Product detail pages with variants
- ✅ Search functionality
- ✅ Shopping cart (persistent in localStorage)
- ✅ Guest checkout (no login required)
- ✅ Order confirmation

### Admin Dashboard
- ✅ Secure authentication (Token-based)
- ✅ Product management (CRUD)
- ✅ Category management (CRUD)
- ✅ Order management and status updates
- ✅ Inventory management
- ✅ Promotion/discount code management
- ✅ CSV import/export
- ✅ Sales and inventory reports
- ✅ Audit logging

### Technical Features
- ✅ RESTful API with versioning
- ✅ API documentation (Swagger/OpenAPI)
- ✅ Unit and integration tests
- ✅ E2E tests with Cypress
- ✅ Code coverage reporting
- ✅ CI/CD pipeline with quality gates
- ✅ Docker containerization
- ✅ Responsive design
- ✅ SEO-friendly (SSR/ISR)

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Git

### Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env` and configure
3. Run `docker-compose up -d`
4. Run migrations: `docker-compose exec backend python manage.py migrate`
5. Create superuser: `docker-compose exec backend python manage.py createsuperuser`
6. Access:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/v1
   - Admin Dashboard: http://localhost:3000/admin
   - API Docs: http://localhost:8000/api/docs

## Testing

### Backend Tests
```bash
docker-compose exec backend pytest
docker-compose exec backend pytest --cov=store --cov-report=html
```

### Frontend Tests
```bash
docker-compose exec frontend npm test
docker-compose exec frontend npm run test:coverage
```

### E2E Tests
```bash
docker-compose exec frontend npm run test:e2e
```

## Coverage Targets

- Backend: ≥70% (achieved with comprehensive test suite)
- Frontend: ≥60% (achieved with component tests)

## API Endpoints

### Public API
- `GET /api/v1/products/` - List products
- `GET /api/v1/products/{slug}/` - Product details
- `GET /api/v1/categories/` - List categories
- `GET /api/v1/search/` - Search products
- `POST /api/v1/checkout/` - Guest checkout
- `GET /api/v1/orders/{reference}/` - Get order by reference

### Admin API (Authenticated)
- `GET/POST/PUT/DELETE /api/v1/admin/products/`
- `GET/POST/PUT/DELETE /api/v1/admin/categories/`
- `GET/POST/PUT/DELETE /api/v1/admin/variants/`
- `GET /api/v1/admin/orders/`
- `PATCH /api/v1/admin/orders/{id}/update_status/`
- `POST /api/v1/admin/import/products-csv/`
- `GET /api/v1/admin/export/orders-csv/`
- `GET /api/v1/admin/reports/sales/`
- `GET /api/v1/admin/reports/low-stock/`

## Documentation

- **README.md**: Setup and quick start guide
- **docs/architecture.md**: System architecture
- **docs/er-diagram.md**: Database schema
- **docs/api-spec.yaml**: OpenAPI specification
- **docs/deployment.md**: Production deployment guide
- **JIRA_BACKLOG.md**: Sprint tasks and backlog

## CI/CD Pipeline

The GitHub Actions pipeline includes:
1. Linting (ESLint, Flake8, Black, isort)
2. Unit tests with coverage
3. SonarQube analysis
4. Docker image builds

Pipeline runs on:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

## Security

- Token-based authentication for admin
- Input validation and sanitization
- SQL injection prevention (Django ORM)
- Rate limiting on checkout endpoint
- CORS configuration
- Secure environment variable handling

## Future Enhancements

- Redis caching for product listings
- S3 integration for image storage
- Real payment gateway integration (Stripe)
- Email templates with HTML
- Customer reviews and ratings
- Wishlist functionality
- Multi-language support

## License

MIT

## Contact

For questions or issues, please open an issue on GitHub.

