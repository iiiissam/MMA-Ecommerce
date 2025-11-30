# 🛍️ Élégance Moderne - E-Commerce Platform

A modern, full-stack e-commerce platform for fashion retail built with Next.js, Django REST Framework, and MySQL.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black)
![Django](https://img.shields.io/badge/Django-4.2-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🛒 **Public Storefront**
- **Guest Shopping:** Browse and purchase without registration
- **Product Catalog:** Hierarchical categories with tree navigation
- **Advanced Search:** Full-text search with pagination
- **Product Variants:** Multiple sizes, colors, and prices per product
- **Shopping Cart:** Persistent cart with Zustand state management
- **Guest Checkout:** Simple checkout with Algerian locations (Wilayas & Baladiyas)
- **Payment:** Cash on Delivery (Paiement à la livraison)
- **Responsive Design:** Mobile-first with Tailwind CSS
- **Image Optimization:** Next.js Image component with Unsplash integration
- **French Language:** Complete French localization

### 🔐 **Admin Dashboard**
- **Secure Authentication:** Token-based authentication
- **Product Management:** 
  - CRUD operations for products
  - Bulk variant creation (comma-separated input)
  - Multiple image management per variant
  - Auto-parent category selection
- **Category Management:** 
  - Hierarchical category structure
  - Parent/child relationships
- **Order Management:**
  - View all orders with status tracking
  - Order details with line items
  - Status updates (Pending, Confirmed, Shipped, Delivered, etc.)
- **Inventory Control:** Stock tracking and low-stock alerts
- **Pagination:** Efficient data browsing (20 items per page)
- **Audit Logging:** Track all admin actions

### 🎨 **Modern UI/UX**
- **Brand Name:** Élégance Moderne (Modern Elegance)
- **Color Theme:** Rose/pink gradient accents
- **Typography:** Serif fonts for elegance
- **Animations:** Smooth transitions and hover effects
- **Icons:** Comprehensive SVG icon system
- **Accessibility:** Semantic HTML and ARIA labels

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand (shopping cart)
- **API Client:** Axios
- **Forms:** React Hook Form
- **Images:** Next.js Image Optimization
- **Routing:** App Router (Next.js 14)

### Backend
- **Framework:** Django 4.2.8
- **API:** Django REST Framework
- **Database:** MySQL 8.0
- **Authentication:** Token-based (DRF)
- **Documentation:** Swagger/OpenAPI (drf-yasg)
- **Filtering:** django-filter
- **CORS:** django-cors-headers

### DevOps & Tools
- **Containerization:** Docker & Docker Compose
- **Code Quality:** SonarQube
- **CI/CD:** GitHub Actions (configured)
- **Version Control:** Git
- **Package Management:** npm (frontend), pip (backend)

---

## 📁 Project Structure

```
MMA/
├── backend/                      # Django REST API
│   ├── app/                     # Django project settings
│   │   ├── settings.py          # Configuration
│   │   ├── urls.py              # Main URL routing
│   │   └── wsgi.py              # WSGI config
│   ├── store/                   # Main application
│   │   ├── models.py            # Database models
│   │   ├── views.py             # API views
│   │   ├── serializers.py       # DRF serializers
│   │   ├── urls.py              # Store URL routing
│   │   ├── admin.py             # Django admin config
│   │   ├── utils.py             # Helper functions
│   │   └── management/          # Custom management commands
│   │       └── commands/
│   │           ├── seed_products.py
│   │           ├── seed_products_large.py
│   │           └── seed_wilayas.py
│   ├── Dockerfile               # Backend container
│   ├── requirements.txt         # Python dependencies
│   └── manage.py                # Django CLI
│
├── frontend/                    # Next.js Application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── collections/    # Product collections
│   │   │   ├── product/        # Product detail
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── checkout/       # Checkout flow
│   │   │   ├── search/         # Search results
│   │   │   ├── order-success/  # Order confirmation
│   │   │   └── admin/          # Admin dashboard
│   │   │       ├── page.tsx    # Admin login
│   │   │       ├── dashboard/  # Admin home
│   │   │       ├── products/   # Product management
│   │   │       ├── categories/ # Category management
│   │   │       └── orders/     # Order management
│   │   ├── components/         # React components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── VariantPicker.tsx
│   │   │   ├── QuantitySelector.tsx
│   │   │   └── FiltersPanel.tsx
│   │   └── lib/               # Utilities
│   │       ├── api.ts         # API client
│   │       ├── store.ts       # Zustand store
│   │       └── placeholder.ts # Image placeholders
│   ├── Dockerfile             # Frontend container
│   ├── package.json           # Dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── tailwind.config.ts     # Tailwind config
│   └── next.config.js         # Next.js config
│
├── .github/
│   └── workflows/
│       └── ci.yml             # CI/CD pipeline
│
├── docker-compose.yml         # Multi-container orchestration
├── sonar-project.properties   # SonarQube configuration
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Docker Desktop (v20.10+)
- Git (v2.30+)
- 8GB RAM minimum
- 5GB free disk space

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd MMA

# 2. Start all services
docker-compose up -d

# 3. Wait for services to initialize (30-60 seconds)
# Check status: docker-compose ps

# 4. Run database migrations
docker-compose exec backend python manage.py migrate

# 5. Create admin user
docker-compose exec backend python manage.py createsuperuser

# 6. Seed database with sample data
docker-compose exec backend python manage.py seed_products_large

# 7. Access the application
# Website: http://localhost:3000
# Admin: http://localhost:3000/admin
# API: http://localhost:8000/api/v1
```

---

## 📖 Detailed Setup

### Step 1: Environment Setup

The project uses Docker Compose to orchestrate all services. No manual environment configuration needed!

**Services included:**
- **Frontend:** Next.js on port 3000
- **Backend:** Django on port 8000
- **Database:** MySQL on port 3307 (mapped from 3306)
- **SonarQube:** Code quality on port 9000

### Step 2: Database Migrations

```bash
# Apply all migrations
docker-compose exec backend python manage.py migrate

# Create new migrations (if you modify models)
docker-compose exec backend python manage.py makemigrations
```

### Step 3: Create Admin User

```bash
docker-compose exec backend python manage.py createsuperuser
```

Follow the prompts to set:
- Username
- Email (optional)
- Password

### Step 4: Seed Data

#### Option A: Small Dataset (15 products)
```bash
docker-compose exec backend python manage.py seed_products
```

#### Option B: Large Dataset (175 products) - **Recommended for testing**
```bash
docker-compose exec backend python manage.py seed_products_large
```

#### Seed Algerian Locations (Required for checkout)
```bash
# If worldcities.csv is in backend folder
docker cp backend/worldcities.csv mma_backend:/tmp/worldcities.csv
docker-compose exec backend python manage.py seed_wilayas /tmp/worldcities.csv
```

This creates:
- 58 Wilayas (provinces)
- 553 Baladiyas (municipalities)

---

## 🌐 Accessing the Application

### Public Website
**URL:** http://localhost:3000

**Pages:**
- **Homepage:** `/` - Hero section, featured categories, random products
- **Collections:** `/collections` - Browse all products with pagination
- **Category:** `/collections/[slug]` - Filter by category
- **Product Detail:** `/product/[slug]` - Product info with variants
- **Search:** `/search?q=query` - Search products
- **Cart:** `/cart` - Shopping cart
- **Checkout:** `/checkout` - Order placement
- **Order Success:** `/order-success?reference=XXX` - Confirmation

### Admin Dashboard
**URL:** http://localhost:3000/admin

**Login:** Use credentials from `createsuperuser`

**Features:**
- **Products:** Manage products and variants
- **Categories:** Manage category hierarchy
- **Orders:** View and update order status
- **Import/Export:** Bulk operations (planned)

### Backend API
**Base URL:** http://localhost:8000/api/v1

**Documentation:** http://localhost:8000/swagger/

**Key Endpoints:**

**Public:**
- `GET /products/` - List products (paginated)
- `GET /products/{slug}/` - Product detail
- `GET /categories/` - List categories
- `GET /search/?q=query` - Search products
- `POST /checkout/` - Create order
- `GET /wilayas/` - List Algerian provinces
- `GET /baladiyas/?wilaya={id}` - List municipalities

**Admin (requires authentication):**
- `GET/POST/PUT/DELETE /admin/products/` - Product CRUD
- `GET/POST/PUT/DELETE /admin/categories/` - Category CRUD
- `GET/POST/PUT/DELETE /admin/variants/` - Variant CRUD
- `GET /admin/orders/` - List orders
- `PATCH /admin/orders/{id}/update_status/` - Update order status

---

## 🗄️ Database Schema

### Core Models

**Category**
- Hierarchical structure (parent/child)
- Slug-based routing
- Active/inactive status

**Product**
- Title, description, brand
- Slug (auto-generated)
- Many-to-many with categories
- Multiple variants

**ProductVariant**
- SKU, size, color
- Price & compare price
- Stock quantity & low-stock threshold
- Main image + multiple additional images
- Active status

**ProductImage**
- Image URL and alt text
- Position ordering
- Linked to variant

**Order**
- Reference number (auto-generated)
- Customer info (name, phone, address)
- Location (wilaya, baladiya)
- Status tracking
- Pricing (subtotal, shipping, total)
- Payment method (cash on delivery)

**OrderLine**
- Product snapshot (SKU, title, price)
- Quantity and line total

**Wilaya & Baladiya**
- Algerian administrative divisions
- Used in checkout form

**AuditLog**
- Track admin actions
- Changes history

---

## 🔧 Development

### Running Services

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Restart a service
docker-compose restart frontend

# Stop all services
docker-compose down
```

### Frontend Development

```bash
# Install new package
docker-compose exec frontend npm install <package-name>

# Access container shell
docker-compose exec frontend sh

# Build for production
docker-compose exec frontend npm run build
```

**Hot Reload:** Frontend automatically reloads on code changes.

### Backend Development

```bash
# Install new Python package
docker-compose exec backend pip install <package-name>
# Then add to requirements.txt

# Access Django shell
docker-compose exec backend python manage.py shell

# Create new app
docker-compose exec backend python manage.py startapp <app-name>

# Run migrations
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Access container shell
docker-compose exec backend bash
```

**Auto-reload:** Django development server reloads on code changes.

### Database Access

```bash
# Access MySQL shell
docker-compose exec db mysql -u store_user -psecret clothes_store

# Backup database
docker-compose exec db mysqldump -u store_user -psecret clothes_store > backup.sql

# Restore database
docker-compose exec -T db mysql -u store_user -psecret clothes_store < backup.sql
```

---

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
docker-compose exec backend pytest

# Run with coverage
docker-compose exec backend pytest --cov=store --cov-report=html

# Run specific test file
docker-compose exec backend pytest store/tests/test_models.py
```

### Frontend Tests

```bash
# Run Jest tests
docker-compose exec frontend npm test

# Run with coverage
docker-compose exec frontend npm test -- --coverage

# Run E2E tests (Cypress)
docker-compose exec frontend npm run cypress:open
```

---

## 🎯 Key Features Explained

### 🛍️ **Bulk Variant Creation**

Admin can create multiple product variants at once using comma-separated values:

**Example:**
- Sizes: `S,M,L,XL`
- Colors: `Noir,Blanc,Rouge`
- Result: 12 variants created automatically (all combinations)

### 🌳 **Category Tree Navigation**

Categories are displayed in a collapsible tree structure:
```
📁 Femmes
  └─ Robes
  └─ Tops & Chemisiers
  └─ Pantalons
📁 Hommes
  └─ Chemises
  └─ T-Shirts
```

### 🛒 **Shopping Flow**

1. Browse products → 2. Select variant → 3. Add to cart → 4. Checkout → 5. Order confirmation

**No customer login required!** Pure guest checkout experience.

### 📦 **Order Management**

Orders include:
- Auto-generated reference number (e.g., `ORD-A3F2D8E1`)
- Customer contact (name, phone)
- Delivery address with Wilaya/Baladiya
- Status tracking (6 states)
- Payment: Cash on Delivery only

---

## 📊 API Documentation

### Authentication

Admin endpoints require token authentication:

```bash
# Get token
curl -X POST http://localhost:8000/api-token-auth/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your-password"}'

# Use token in requests
curl http://localhost:8000/api/v1/admin/products/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### Pagination

All list endpoints support pagination:

**Request:**
```
GET /api/v1/products/?page=2
```

**Response:**
```json
{
  "count": 175,
  "next": "http://localhost:8000/api/v1/products/?page=3",
  "previous": "http://localhost:8000/api/v1/products/?page=1",
  "results": [...]
}
```

### Filtering & Search

**Filter by category:**
```
GET /api/v1/products/?category=robes
```

**Search products:**
```
GET /api/v1/products/?search=chemise
```

**Filter by price range:**
```
GET /api/v1/products/?price_min=1000&price_max=5000
```

---

## 🚢 Deployment

### Docker Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Run in production mode
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

Create `.env` file in the project root:

```env
# Database
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_DATABASE=clothes_store
MYSQL_USER=store_user
MYSQL_PASSWORD=<your-secure-password>

# Django
DJANGO_SECRET_KEY=<generate-secure-key>
DJANGO_DEBUG=0
DJANGO_ALLOWED_HOSTS=your-domain.com

# Frontend
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_SITE_NAME=Élégance Moderne
NEXT_PUBLIC_CURRENCY=DA

# Email (optional)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=1
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=<app-password>
```

### Security Checklist

- [ ] Change default database credentials
- [ ] Generate new Django SECRET_KEY
- [ ] Set `DJANGO_DEBUG=0` in production
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Use HTTPS in production
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Review CORS settings

---

## 📚 Database Models Overview

### **Product Model**
```python
- title: CharField
- slug: SlugField (unique, auto-generated)
- description: TextField
- brand: CharField
- is_active: BooleanField
- created_at, updated_at: DateTimeField
```

### **ProductVariant Model**
```python
- product: ForeignKey(Product)
- sku: CharField (unique)
- size, color: CharField
- price: DecimalField
- compare_at_price: DecimalField (nullable)
- stock_quantity: IntegerField
- low_stock_threshold: IntegerField
- image_main: URLField
- is_active: BooleanField
```

### **Order Model**
```python
- reference: CharField (unique, e.g., ORD-A3F2D8E1)
- status: CharField (choices)
- name, phone, address: CharField
- wilaya, baladiya: ForeignKey
- subtotal, shipping_cost, total: DecimalField
- payment_method, payment_status: CharField
- created_at, updated_at: DateTimeField
```

---

## 🎨 Design System

### Color Palette

- **Primary:** Rose/Pink (#F43F5E to #E11D48)
- **Text:** Gray-900 (#111827)
- **Background:** White & Gray-50
- **Accents:** Rose gradient

### Typography

- **Headings:** Serif fonts (font-serif)
- **Body:** Sans-serif (default)
- **Sizes:** Responsive (text-4xl to text-sm)

### Components

- **Buttons:** Rounded-full with gradients
- **Cards:** Rounded-xl with subtle shadows
- **Inputs:** Rounded-lg with rose focus rings
- **Badges:** Rounded-full with color coding

---

## 🔍 Features in Detail

### Checkout Process

1. **Cart Review:** View items, adjust quantities
2. **Customer Info:** Name and phone number
3. **Delivery Address:** Full address with Wilaya/Baladiya dropdowns
4. **Payment Method:** Cash on Delivery (fixed)
5. **Order Confirmation:** Unique reference number generated

### Admin Product Management

**Creating a Product:**
1. Enter title, description, brand
2. Select subcategory (parent auto-selected)
3. Set active status
4. Click "Create"
5. Navigate to variant management
6. Add variants (individually or in bulk)

**Bulk Variant Creation:**
1. Enable "Mode Création Multiple"
2. Enter sizes: `S,M,L,XL`
3. Enter colors: `Noir,Blanc,Bleu`
4. Set price and stock
5. System creates all 12 combinations automatically

### Category Management

- **Hierarchical Structure:** Parent → Children
- **Tree Navigation:** Collapsible category tree on collections page
- **Auto-Selection:** Selecting child auto-selects parent in product forms

---

## 📦 Available Commands

### Django Management Commands

```bash
# Seed products (small dataset - 15 products)
docker-compose exec backend python manage.py seed_products

# Seed products (large dataset - 175 products)
docker-compose exec backend python manage.py seed_products_large

# Seed Algerian locations
docker-compose exec backend python manage.py seed_wilayas <csv-path>

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Django shell
docker-compose exec backend python manage.py shell
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
# Kill process or change port in docker-compose.yml
```

### Database Connection Issues

```bash
# Check if database is ready
docker-compose exec db mysql -u store_user -psecret -e "SELECT 1"

# Restart database
docker-compose restart db
```

### Images Not Loading

- Ensure internet connection (images from Unsplash)
- Check browser console for errors
- Hard refresh: `Ctrl + Shift + R`

### Admin Can't Login

```bash
# Reset admin password
docker-compose exec backend python manage.py changepassword <username>
```

### Clear Cache and Restart

```bash
# Stop everything
docker-compose down

# Remove volumes (⚠️ deletes all data)
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

---

## 📈 Performance Optimization

### Database Indexes
- Products: `slug`, `created_at`
- Orders: `reference`, `status`, `phone`, `created_at`
- Categories: `slug`

### Frontend Optimization
- Image optimization with Next.js Image component
- Static generation for product pages (ISR)
- Client-side state management with Zustand
- Pagination to limit data transfer

### Backend Optimization
- Database query optimization with `select_related` and `prefetch_related`
- API response caching (60s revalidation)
- Rate limiting on checkout endpoint

---

## 🔐 Security Features

- **Admin Authentication:** Token-based authentication
- **CORS Protection:** Configured allowed origins
- **SQL Injection Prevention:** Django ORM
- **XSS Protection:** React automatic escaping
- **CSRF Protection:** Django CSRF middleware
- **Rate Limiting:** Throttling on sensitive endpoints
- **Input Validation:** Serializer validation on backend

---

## 📞 Support

### Common Issues

1. **Docker not starting:** Ensure Docker Desktop is running
2. **Port conflicts:** Check if ports 3000, 8000, 3307 are available
3. **Out of memory:** Increase Docker memory limit to 4GB+
4. **Database errors:** Wait for db to fully initialize (30-60s)

### Getting Help

- Check the logs: `docker-compose logs -f`
- Review the API docs: http://localhost:8000/swagger/
- Inspect database: Use MySQL Workbench on port 3307

---

## 🤝 Contributing

### Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test locally with Docker
4. Commit with descriptive messages
5. Push and create Pull Request

### Code Style

**Frontend:**
- TypeScript strict mode
- ESLint + Prettier
- Tailwind CSS for styling
- Functional components with hooks

**Backend:**
- PEP 8 style guide
- Black formatter
- Type hints where applicable
- Django best practices

---

## 📝 License

This project is licensed under the MIT License.

---

## 🎯 Roadmap

### Completed ✅
- Full guest shopping experience
- Admin dashboard with CRUD
- Hierarchical categories
- Product variants with images
- Algerian location integration
- Cash on delivery payment
- Pagination system
- French localization
- Modern responsive UI

### Planned 🚧
- Email notifications
- Order tracking for customers
- Advanced reporting
- Inventory alerts
- CSV import/export
- Multi-language support
- Payment gateway integration
- Customer accounts (optional)
- Wishlist functionality

---

## 👥 Team

**Full-Stack E-Commerce Platform**
- Modern, scalable architecture
- Production-ready codebase
- Comprehensive documentation

---

## 📸 Screenshots

### Public Website
- Clean, modern design with rose/pink theme
- Responsive product cards
- Hierarchical category navigation
- Smooth checkout process

### Admin Dashboard
- Professional admin interface
- Bulk variant creation
- Order management
- Real-time stock tracking

---

## 🙏 Acknowledgments

- **Images:** [Unsplash](https://unsplash.com/) - Free high-quality photos
- **Icons:** Custom SVG icons
- **UI Inspiration:** Modern fashion e-commerce platforms

---

**Built with ❤️ for fashion retail**

For detailed setup instructions, see the inline comments in `docker-compose.yml` and individual Dockerfiles.

For API documentation, visit http://localhost:8000/swagger/ after starting the backend.

