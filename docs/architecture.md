# Architecture Documentation

## System Overview

The Clothes Store e-commerce application is a full-stack application built with:
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Django 4 with Django REST Framework
- **Database**: MySQL 8
- **DevOps**: Docker, Docker Compose, GitHub Actions

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS
                        │
        ┌───────────────┴───────────────┐
        │                                 │
        ▼                                 ▼
┌───────────────┐              ┌──────────────────┐
│  Next.js      │              │  Admin Dashboard │
│  Frontend     │              │  (Next.js)       │
│  (Port 3000)  │              │  (Port 3000)    │
└───────┬───────┘              └────────┬─────────┘
        │                                │
        │ REST API                       │ REST API (Authenticated)
        │                                │
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Django REST Framework │
        │  (Port 8000)           │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │      MySQL Database    │
        │      (Port 3306)       │
        └────────────────────────┘
```

## Component Architecture

### Frontend (Next.js)

- **Pages**: Server-side rendered pages using Next.js App Router
- **Components**: Reusable React components
- **State Management**: Zustand for cart state
- **API Client**: Axios with SWR for data fetching
- **Styling**: Tailwind CSS

### Backend (Django)

- **Models**: Django ORM models for data persistence
- **Views**: Django REST Framework viewsets
- **Serializers**: DRF serializers for API data transformation
- **Authentication**: Token-based authentication for admin
- **Permissions**: Role-based access control

### Database Schema

See `docs/er-diagram.md` for detailed ER diagram.

## API Architecture

### Public API (`/api/v1/`)

- `GET /products/` - List products with filters
- `GET /products/{slug}/` - Product details
- `GET /categories/` - List categories
- `GET /search/` - Search products
- `POST /cart/validate/` - Validate cart
- `POST /checkout/` - Guest checkout
- `GET /orders/{reference}/` - Get order by reference

### Admin API (`/api/v1/admin/`)

- `GET/POST/PUT/DELETE /admin/products/` - Product CRUD
- `GET/POST/PUT/DELETE /admin/categories/` - Category CRUD
- `GET/POST/PUT/DELETE /admin/variants/` - Variant CRUD
- `GET /admin/orders/` - List orders
- `PATCH /admin/orders/{id}/update_status/` - Update order status
- `POST /admin/import/products-csv/` - Import products
- `GET /admin/export/orders-csv/` - Export orders
- `GET /admin/reports/sales/` - Sales report
- `GET /admin/reports/low-stock/` - Low stock report

## Security

- **Authentication**: Token-based for admin endpoints
- **Authorization**: Role-based (admin vs public)
- **Input Validation**: Django serializers and form validation
- **SQL Injection**: Prevented by Django ORM
- **Rate Limiting**: DRF throttling on checkout endpoint
- **CORS**: Configured for frontend origins

## Deployment

### Local Development

```bash
docker-compose up
```

### Production

1. Set environment variables
2. Build Docker images
3. Deploy to cloud provider (Heroku, AWS, GCP, etc.)
4. Configure database backups
5. Set up monitoring and logging

## Scalability Considerations

- **Caching**: Redis can be added for product listings
- **CDN**: For static assets and images
- **Database**: Read replicas for scaling reads
- **Load Balancing**: Multiple backend instances
- **Image Storage**: S3 or similar for production

