# Jira Backlog & Sprint Tasks

## Sprint 0: Setup & Infrastructure (Week 1)

### Tasks
- [x] **SPRINT-0-1**: Initialize Git repository with branch strategy (main, develop, feature/*)
- [x] **SPRINT-0-2**: Setup Docker and docker-compose.yml for local development
- [x] **SPRINT-0-3**: Create Django backend project structure
- [x] **SPRINT-0-4**: Create Next.js frontend project structure
- [x] **SPRINT-0-5**: Configure MySQL database connection
- [x] **SPRINT-0-6**: Setup SonarQube in docker-compose
- [x] **SPRINT-0-7**: Create GitHub Actions CI pipeline skeleton
- [x] **SPRINT-0-8**: Write initial README with setup instructions

### Demo Video: Sprint 0
- Repository setup
- Docker compose running
- Basic project structure

---

## Sprint 1: Product Management (Week 2)

### Tasks
- [x] **SPRINT-1-1**: Create Django models (Product, Category, ProductVariant, ProductImage)
- [x] **SPRINT-1-2**: Create database migrations
- [x] **SPRINT-1-3**: Implement Product API endpoints (GET /products/, GET /products/{slug}/)
- [x] **SPRINT-1-4**: Implement Category API endpoints (GET /categories/)
- [x] **SPRINT-1-5**: Create product list page (Next.js)
- [x] **SPRINT-1-6**: Create product detail page (Next.js)
- [x] **SPRINT-1-7**: Implement product filtering and search
- [x] **SPRINT-1-8**: Add unit tests for product models and API

### Demo Video: Sprint 1
- Product listing with filters
- Product detail page
- Search functionality

---

## Sprint 2: Cart & Checkout (Week 3)

### Tasks
- [x] **SPRINT-2-1**: Implement cart state management (Zustand)
- [x] **SPRINT-2-2**: Create cart page UI
- [x] **SPRINT-2-3**: Implement cart validation API endpoint
- [x] **SPRINT-2-4**: Create Order and OrderLine models
- [x] **SPRINT-2-5**: Implement guest checkout API endpoint
- [x] **SPRINT-2-6**: Create checkout form page
- [x] **SPRINT-2-7**: Implement mock payment processor
- [x] **SPRINT-2-8**: Create order confirmation page
- [x] **SPRINT-2-9**: Add stock decrement on order creation
- [x] **SPRINT-2-10**: Basic admin product CRUD API

### Demo Video: Sprint 2
- Add to cart functionality
- Guest checkout flow
- Order creation

---

## Sprint 3: Admin Dashboard & Features (Week 4)

### Tasks
- [x] **SPRINT-3-1**: Implement admin authentication (JWT/Token)
- [x] **SPRINT-3-2**: Create admin dashboard layout
- [x] **SPRINT-3-3**: Build admin product management UI
- [x] **SPRINT-3-4**: Build admin category management UI
- [x] **SPRINT-3-5**: Build admin order management UI
- [x] **SPRINT-3-6**: Implement Promotion model and API
- [x] **SPRINT-3-7**: Add promotion code support to checkout
- [x] **SPRINT-3-8**: Implement CSV import for products
- [x] **SPRINT-3-9**: Implement CSV export for orders
- [x] **SPRINT-3-10**: Create audit log system
- [x] **SPRINT-3-11**: Add inventory management features
- [x] **SPRINT-3-12**: Build reports page (sales, low stock)

### Demo Video: Sprint 3
- Admin login and dashboard
- Product management
- Order management
- CSV import/export

---

## Sprint 4: Testing, Quality & Polish (Week 5)

### Tasks
- [x] **SPRINT-4-1**: Write backend unit tests (target 70% coverage)
- [x] **SPRINT-4-2**: Write frontend unit tests (target 60% coverage)
- [x] **SPRINT-4-3**: Write integration tests for API endpoints
- [x] **SPRINT-4-4**: Write E2E tests with Cypress (critical flows)
- [x] **SPRINT-4-5**: Configure SonarQube quality gates
- [x] **SPRINT-4-6**: Fix code quality issues
- [x] **SPRINT-4-7**: UI/UX polish and accessibility improvements
- [x] **SPRINT-4-8**: Complete API documentation (OpenAPI/Swagger)
- [x] **SPRINT-4-9**: Create architecture and ER diagrams
- [x] **SPRINT-4-10**: Write deployment documentation
- [x] **SPRINT-4-11**: Final demo video and presentation

### Demo Video: Sprint 4 (Final)
- Complete application walkthrough
- Admin features
- Public storefront
- Test coverage report
- CI/CD pipeline demonstration

---

## Acceptance Criteria Checklist

### Public Storefront
- [x] Homepage displays featured products and categories
- [x] Product listing with filters and pagination
- [x] Product detail page with variants and images
- [x] Search functionality works
- [x] Cart persists in browser (localStorage)
- [x] Guest checkout creates order successfully
- [x] Order confirmation page displays reference

### Admin Dashboard
- [x] Admin login required
- [x] Product CRUD operations
- [x] Category CRUD operations
- [x] Order management and status updates
- [x] Inventory management
- [x] CSV import/export
- [x] Reports (sales, low stock)
- [x] Audit log visible

### Technical
- [x] Docker compose runs all services
- [x] CI pipeline runs on PR
- [x] Tests pass with coverage reports
- [x] SonarQube analysis runs
- [x] Code quality gates pass
- [x] Documentation complete

---

## Notes

- All tasks are tracked in this backlog
- Each PR should reference the related Jira ticket
- Demo videos should be recorded for Sprint 0 and final sprint
- Code coverage targets: Backend ≥70%, Frontend ≥60%

