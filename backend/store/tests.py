"""
Tests for the store app.
"""

from decimal import Decimal

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import Baladiya, Category, Client, Order, Product, ProductVariant, Wilaya


class CategoryModelTest(TestCase):
    """Test Category model."""

    def setUp(self):
        self.category = Category.objects.create(
            name="Test Category", description="Test description"
        )

    def test_category_creation(self):
        self.assertEqual(str(self.category), "Test Category")
        self.assertTrue(self.category.slug)

    def test_category_slug_auto_generation(self):
        self.assertEqual(self.category.slug, "test-category")


class ProductModelTest(TestCase):
    """Test Product model."""

    def setUp(self):
        self.product = Product.objects.create(
            title="Test Product", description="Test description", brand="Test Brand"
        )

    def test_product_creation(self):
        self.assertEqual(str(self.product), "Test Product")
        self.assertTrue(self.product.slug)


class ProductVariantModelTest(TestCase):
    """Test ProductVariant model."""

    def setUp(self):
        self.product = Product.objects.create(title="Test Product", description="Test")
        self.variant = ProductVariant.objects.create(
            product=self.product,
            sku="TEST-001",
            price=Decimal("29.99"),
            stock_quantity=10,
        )

    def test_variant_creation(self):
        self.assertEqual(str(self.variant), f"{self.product.title} - TEST-001")

    def test_is_in_stock(self):
        self.assertTrue(self.variant.is_in_stock)
        self.variant.stock_quantity = 0
        self.assertFalse(self.variant.is_in_stock)

    def test_is_low_stock(self):
        self.variant.stock_quantity = 5
        self.variant.low_stock_threshold = 10
        self.assertTrue(self.variant.is_low_stock)


class OrderModelTest(TestCase):
    """Test Order model."""

    def setUp(self):
        self.wilaya = Wilaya.objects.create(name="Alger", code="16")
        self.baladiya = Baladiya.objects.create(name="Alger Centre", wilaya=self.wilaya)
        self.order = Order.objects.create(
            name="Test User",
            phone="0550123456",
            address="123 Main St",
            wilaya=self.wilaya,
            baladiya=self.baladiya,
            subtotal=Decimal("100.00"),
            shipping_cost=Decimal("20.00"),
            total=Decimal("120.00"),
        )

    def test_order_creation(self):
        self.assertTrue(self.order.reference)
        self.assertTrue(self.order.reference.startswith("ORD-"))

    def test_order_reference_generation(self):
        order2 = Order.objects.create(
            name="Test User 2",
            phone="0550654321",
            address="456 Other St",
            wilaya=self.wilaya,
            baladiya=self.baladiya,
            subtotal=Decimal("50.00"),
            shipping_cost=Decimal("10.00"),
            total=Decimal("60.00"),
        )
        self.assertNotEqual(self.order.reference, order2.reference)


class ClientModelTest(TestCase):
    """Test Client model."""

    def setUp(self):
        from django.contrib.auth.hashers import make_password

        self.client = Client.objects.create(
            email="test@example.com",
            password=make_password("testpass123"),
            first_name="Test",
            last_name="User",
            phone="0550123456",
        )

    def test_client_creation(self):
        self.assertEqual(str(self.client), "Test User (test@example.com)")
        self.assertEqual(self.client.full_name, "Test User")

    def test_client_email_unique(self):
        from django.db import IntegrityError

        with self.assertRaises(IntegrityError):
            Client.objects.create(
                email="test@example.com",
                password="hashed",
                first_name="Another",
                last_name="User",
            )


class ProductAPITest(TestCase):
    """Test Product API endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Test Category")
        self.product = Product.objects.create(
            title="Test Product", description="Test description"
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            sku="TEST-001",
            price=Decimal("29.99"),
            stock_quantity=10,
        )

    def test_list_products(self):
        response = self.client.get("/api/v1/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_product_detail(self):
        response = self.client.get(f"/api/v1/products/{self.product.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Test Product")

    def test_search_products(self):
        response = self.client.get("/api/v1/search/", {"q": "Test"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CheckoutAPITest(TestCase):
    """Test Checkout API."""

    def setUp(self):
        self.client = APIClient()
        self.product = Product.objects.create(title="Test Product", description="Test")
        self.variant = ProductVariant.objects.create(
            product=self.product,
            sku="TEST-001",
            price=Decimal("29.99"),
            stock_quantity=10,
        )

    def test_checkout_success(self):
        wilaya = Wilaya.objects.create(name="Alger", code="16")
        baladiya = Baladiya.objects.create(name="Alger Centre", wilaya=wilaya)
        data = {
            "items": [{"variant_id": self.variant.id, "quantity": 2}],
            "name": "Test User",
            "phone": "0550123456",
            "address": "123 Main St",
            "wilaya": wilaya.id,
            "baladiya": baladiya.id,
        }
        response = self.client.post("/api/v1/checkout/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["reference"])

    def test_checkout_insufficient_stock(self):
        wilaya = Wilaya.objects.create(name="Alger", code="16")
        baladiya = Baladiya.objects.create(name="Alger Centre", wilaya=wilaya)
        data = {
            "items": [{"variant_id": self.variant.id, "quantity": 100}],
            "name": "Test User",
            "phone": "0550123456",
            "address": "123 Main St",
            "wilaya": wilaya.id,
            "baladiya": baladiya.id,
        }
        response = self.client.post("/api/v1/checkout/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AdminAPITest(TestCase):
    """Test Admin API endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="admin", password="admin123", is_staff=True, is_superuser=True
        )
        self.client.force_authenticate(user=self.user)

    def test_admin_product_list(self):
        response = self.client.get("/api/v1/admin/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_create_product(self):
        data = {
            "title": "New Product",
            "description": "New description",
            "brand": "New Brand",
            "is_active": True,
        }
        response = self.client.post("/api/v1/admin/products/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
