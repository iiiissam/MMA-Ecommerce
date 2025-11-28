# Deployment Guide

## Production Deployment

### Prerequisites

- Docker and Docker Compose installed
- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- Environment variables configured

### Environment Variables

Create a `.env` file with production values:

```bash
# Database
MYSQL_HOST=db
MYSQL_DATABASE=clothes_store_prod
MYSQL_USER=store_user
MYSQL_PASSWORD=<strong-password>

# Django
DJANGO_SECRET_KEY=<generate-secure-key>
DJANGO_DEBUG=0
DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Deployment Steps

1. **Build Docker Images**

```bash
docker-compose -f docker-compose.prod.yml build
```

2. **Run Migrations**

```bash
docker-compose -f docker-compose.prod.yml run backend python manage.py migrate
```

3. **Create Superuser**

```bash
docker-compose -f docker-compose.prod.yml run backend python manage.py createsuperuser
```

4. **Collect Static Files**

```bash
docker-compose -f docker-compose.prod.yml run backend python manage.py collectstatic --noinput
```

5. **Start Services**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Database Backups

#### Automated Backup Script

Create a cron job to backup MySQL daily:

```bash
0 2 * * * docker exec mma_db mysqldump -u store_user -p<password> clothes_store > /backups/clothes_store_$(date +\%Y\%m\%d).sql
```

#### Restore Backup

```bash
docker exec -i mma_db mysql -u store_user -p<password> clothes_store < backup.sql
```

### Monitoring

- Set up logging aggregation (ELK stack, CloudWatch, etc.)
- Configure error tracking (Sentry)
- Set up uptime monitoring
- Monitor database performance

### Scaling

- Use load balancer for multiple backend instances
- Configure read replicas for MySQL
- Use CDN for static assets
- Consider Redis for caching

### Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Regular security updates
- [ ] Database backups encrypted
- [ ] Secrets in environment variables, not code

