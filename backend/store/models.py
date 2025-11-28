"""
Store models for the e-commerce application.
"""
from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
import json


class Wilaya(models.Model):
    """Algerian Wilaya (Province)."""
    name = models.CharField(max_length=100, unique=True, db_index=True)
    code = models.CharField(max_length=10, unique=True, blank=True, null=True)
    
    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
        ]
    
    def __str__(self):
        return self.name


class Baladiya(models.Model):
    """Algerian Baladiya (City/Municipality)."""
    name = models.CharField(max_length=100, db_index=True)
    wilaya = models.ForeignKey(Wilaya, on_delete=models.CASCADE, related_name='baladiyas')
    
    class Meta:
        ordering = ['name']
        unique_together = ['name', 'wilaya']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['wilaya']),
        ]
    
    def __str__(self):
        return f"{self.name}, {self.wilaya.name}"


class Category(models.Model):
    """Product category with tree structure support."""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, db_index=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    """Main product model."""
    title = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, unique=True, db_index=True)
    description = models.TextField()
    brand = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
            models.Index(fields=['brand']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class ProductCategory(models.Model):
    """Many-to-many relationship between products and categories."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_categories')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='category_products')

    class Meta:
        unique_together = ['product', 'category']
        verbose_name_plural = "Product Categories"

    def __str__(self):
        return f"{self.product.title} - {self.category.name}"


class ProductVariant(models.Model):
    """Product variant (size, color, etc.) with inventory."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    sku = models.CharField(max_length=100, unique=True, db_index=True)
    size = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=50, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    compare_at_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    stock_quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    low_stock_threshold = models.IntegerField(default=10, validators=[MinValueValidator(0)])
    barcode = models.CharField(max_length=100, blank=True)
    weight = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    image_main = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sku']
        indexes = [
            models.Index(fields=['sku']),
            models.Index(fields=['is_active']),
            models.Index(fields=['stock_quantity']),
        ]

    def __str__(self):
        return f"{self.product.title} - {self.sku}"

    @property
    def is_low_stock(self):
        return self.stock_quantity <= self.low_stock_threshold

    @property
    def is_in_stock(self):
        return self.stock_quantity > 0


class ProductImage(models.Model):
    """Product images."""
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField()
    alt_text = models.CharField(max_length=200, blank=True)
    position = models.IntegerField(default=0)

    class Meta:
        ordering = ['position', 'id']

    def __str__(self):
        return f"Image for {self.variant.sku}"


class Order(models.Model):
    """Order model for guest checkout."""
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('returned', 'Returned'),
    ]

    reference = models.CharField(max_length=50, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    
    # Customer info
    name = models.CharField(max_length=200, blank=True, default='')
    phone = models.CharField(max_length=20, db_index=True, blank=True, default='')
    address = models.TextField(blank=True, default='')
    wilaya = models.ForeignKey(Wilaya, on_delete=models.PROTECT, related_name='orders', null=True, blank=True)
    baladiya = models.ForeignKey(Baladiya, on_delete=models.PROTECT, related_name='orders', null=True, blank=True)
    
    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    total = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Payment
    payment_method = models.CharField(max_length=50, default='cash_on_delivery')
    payment_status = models.CharField(max_length=20, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['reference']),
            models.Index(fields=['status']),
            models.Index(fields=['phone']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Order {self.reference}"

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = self.generate_reference()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_reference():
        """Generate unique order reference."""
        return f"ORD-{uuid.uuid4().hex[:8].upper()}"


class OrderLine(models.Model):
    """Order line items with price snapshots."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='lines')
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True)
    sku_snapshot = models.CharField(max_length=100)
    title_snapshot = models.CharField(max_length=200)
    price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    line_total = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.order.reference} - {self.sku_snapshot} x{self.quantity}"


class AuditLog(models.Model):
    """Audit log for admin actions."""
    ACTION_TYPES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('import', 'Import'),
        ('export', 'Export'),
    ]

    admin_user = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='audit_logs'
    )
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=100, blank=True)
    changes = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['timestamp']),
            models.Index(fields=['admin_user', 'timestamp']),
            models.Index(fields=['model_name']),
        ]

    def __str__(self):
        return f"{self.action_type} {self.model_name} by {self.admin_user} at {self.timestamp}"

