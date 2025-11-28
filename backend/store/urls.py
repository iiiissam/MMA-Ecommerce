"""
URL configuration for store API.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Public endpoints
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'wilayas', views.WilayaViewSet, basename='wilaya')
router.register(r'baladiyas', views.BaladiyaViewSet, basename='baladiya')

# Admin endpoints
router.register(r'admin/categories', views.AdminCategoryViewSet, basename='admin-category')
router.register(r'admin/products', views.AdminProductViewSet, basename='admin-product')
router.register(r'admin/variants', views.AdminProductVariantViewSet, basename='admin-variant')
router.register(r'admin/orders', views.AdminOrderViewSet, basename='admin-order')
router.register(r'admin/audit-logs', views.AdminAuditLogViewSet, basename='admin-audit-log')

urlpatterns = [
    path('', include(router.urls)),
    
    # Public endpoints
    path('search/', views.search_products, name='search'),
    path('cart/validate/', views.validate_cart, name='validate-cart'),
    path('checkout/', views.checkout, name='checkout'),
    path('orders/<str:reference>/', views.get_order_by_reference, name='order-by-reference'),
    
    # Admin endpoints
    path('admin/import/products-csv/', views.import_products_csv, name='import-products-csv'),
    path('admin/export/orders-csv/', views.export_orders_csv, name='export-orders-csv'),
]

