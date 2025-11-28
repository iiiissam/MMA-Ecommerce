"""
API views for the store.
"""
import csv
import io
from decimal import Decimal
from django.db.models import Q, Sum, Count
from django.db import transaction
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import (
    Category, Product, ProductVariant, ProductImage,
    Order, OrderLine, AuditLog, ProductCategory, Wilaya, Baladiya
)
from .serializers import (
    CategorySerializer, ProductSerializer, ProductDetailSerializer,
    ProductVariantSerializer, OrderSerializer,
    CheckoutSerializer, AuditLogSerializer, AdminProductSerializer,
    WilayaSerializer, BaladiyaSerializer
)
from .utils import log_admin_action, calculate_order_totals, process_payment


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Category viewset (read-only for public)."""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = super().get_queryset()
        parent = self.request.query_params.get('parent', None)
        if parent:
            if parent == 'null':
                queryset = queryset.filter(parent__isnull=True)
            else:
                queryset = queryset.filter(parent__slug=parent)
        return queryset


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """Product viewset for public API."""
    queryset = Product.objects.filter(is_active=True).prefetch_related('variants', 'product_categories__category')
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['brand']
    search_fields = ['title', 'description', 'brand']
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(product_categories__category__slug=category)
        
        # Filter by price range
        price_min = self.request.query_params.get('price_min', None)
        price_max = self.request.query_params.get('price_max', None)
        if price_min or price_max:
            variant_filter = Q()
            if price_min:
                variant_filter &= Q(price__gte=Decimal(price_min))
            if price_max:
                variant_filter &= Q(price__lte=Decimal(price_max))
            variant_ids = ProductVariant.objects.filter(variant_filter).values_list('id', flat=True)
            queryset = queryset.filter(variants__id__in=variant_ids).distinct()
        
        # Filter by size/color
        size = self.request.query_params.get('size', None)
        color = self.request.query_params.get('color', None)
        if size or color:
            variant_filter = Q()
            if size:
                variant_filter &= Q(size=size)
            if color:
                variant_filter &= Q(color=color)
            variant_ids = ProductVariant.objects.filter(variant_filter).values_list('id', flat=True)
            queryset = queryset.filter(variants__id__in=variant_ids).distinct()
        
        return queryset

    def retrieve(self, request, *args, **kwargs):
        """Get product detail with variants."""
        instance = self.get_object()
        serializer = ProductDetailSerializer(instance)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def search_products(request):
    """Search products endpoint."""
    query = request.query_params.get('q', '')
    if not query:
        return Response({'results': [], 'count': 0})
    
    products = Product.objects.filter(
        Q(is_active=True) &
        (Q(title__icontains=query) |
         Q(description__icontains=query) |
         Q(brand__icontains=query) |
         Q(variants__sku__icontains=query))
    ).distinct()[:20]
    
    serializer = ProductSerializer(products, many=True)
    return Response({
        'results': serializer.data,
        'count': len(serializer.data)
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def validate_cart(request):
    """Validate cart items and return totals."""
    items = request.data.get('items', [])
    errors = []
    validated_items = []
    total = Decimal('0.00')
    
    for item in items:
        variant_id = item.get('variant_id')
        quantity = item.get('quantity', 1)
        
        try:
            variant = ProductVariant.objects.get(id=variant_id, is_active=True)
            if variant.stock_quantity < quantity:
                errors.append(f"Insufficient stock for {variant.sku}. Available: {variant.stock_quantity}")
            else:
                line_total = variant.price * quantity
                total += line_total
                validated_items.append({
                    'variant_id': variant.id,
                    'sku': variant.sku,
                    'title': variant.product.title,
                    'price': str(variant.price),
                    'quantity': quantity,
                    'line_total': str(line_total)
                })
        except ProductVariant.DoesNotExist:
            errors.append(f"Variant {variant_id} not found")
    
    return Response({
        'valid': len(errors) == 0,
        'errors': errors,
        'items': validated_items,
        'subtotal': str(total),
        'total': str(total)  # Will be recalculated with shipping in checkout
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def checkout(request):
    """Guest checkout endpoint."""
    serializer = CheckoutSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    items = data['items']
    
    # Validate stock and build order lines
    order_lines_data = []
    subtotal = Decimal('0.00')
    
    with transaction.atomic():
        for item in items:
            variant_id = item['variant_id']
            quantity = item['quantity']
            
            try:
                variant = ProductVariant.objects.select_for_update().get(
                    id=variant_id,
                    is_active=True
                )
                
                if variant.stock_quantity < quantity:
                    return Response(
                        {'error': f'Insufficient stock for {variant.sku}. Available: {variant.stock_quantity}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Reserve stock
                variant.stock_quantity -= quantity
                variant.save()
                
                line_total = variant.price * quantity
                subtotal += line_total
                
                order_lines_data.append({
                    'variant': variant,
                    'sku_snapshot': variant.sku,
                    'title_snapshot': variant.product.title,
                    'price_snapshot': variant.price,
                    'quantity': quantity,
                    'line_total': line_total
                })
            except ProductVariant.DoesNotExist:
                return Response(
                    {'error': f'Variant {variant_id} not found'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Calculate totals
        shipping_cost = Decimal('10.00')  # Default shipping
        total = subtotal + shipping_cost
        
        # Get wilaya and baladiya
        wilaya = Wilaya.objects.get(id=data['wilaya'])
        baladiya = Baladiya.objects.get(id=data['baladiya'])
        
        # Payment on delivery - no payment processing needed
        # Create order with pending payment status
        order = Order.objects.create(
            status='pending',  # Will be confirmed when payment is received on delivery
            name=data['name'],
            phone=data['phone'],
            address=data['address'],
            wilaya=wilaya,
            baladiya=baladiya,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            total=total,
            payment_method='cash_on_delivery',
            payment_status='pending',  # Payment on delivery - always pending until delivery
        )
        
        # Create order lines
        for line_data in order_lines_data:
            OrderLine.objects.create(
                order=order,
                product_variant=line_data['variant'],
                sku_snapshot=line_data['sku_snapshot'],
                title_snapshot=line_data['title_snapshot'],
                price_snapshot=line_data['price_snapshot'],
                quantity=line_data['quantity'],
                line_total=line_data['line_total']
            )
        
        # Send confirmation email (mock/console)
        try:
            send_mail(
                subject=f'Order Confirmation - {order.reference}',
                message=f'Thank you for your order {order.reference}. Total: {order.total}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[order.email],
                fail_silently=True
            )
        except Exception as e:
            print(f"Email send failed: {e}")
    
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_order_by_reference(request, reference):
    """Get order by reference (for guest order lookup)."""
    email = request.query_params.get('email', '')
    try:
        order = Order.objects.get(reference=reference, email=email)
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found'},
            status=status.HTTP_404_NOT_FOUND
        )


# Admin viewsets
class AdminCategoryViewSet(viewsets.ModelViewSet):
    """Admin category viewset."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'slug'

    def perform_create(self, serializer):
        instance = serializer.save()
        log_admin_action(
            self.request.user,
            'create',
            'Category',
            str(instance.id),
            {'name': instance.name}
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        log_admin_action(
            self.request.user,
            'update',
            'Category',
            str(instance.id),
            serializer.validated_data
        )

    def perform_destroy(self, instance):
        log_admin_action(
            self.request.user,
            'delete',
            'Category',
            str(instance.id),
            {'name': instance.name}
        )
        instance.delete()


class AdminProductViewSet(viewsets.ModelViewSet):
    """Admin product viewset."""
    queryset = Product.objects.all().prefetch_related('variants', 'product_categories')
    serializer_class = AdminProductSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description', 'brand']

    def perform_create(self, serializer):
        instance = serializer.save()
        log_admin_action(
            self.request.user,
            'create',
            'Product',
            str(instance.id),
            {'title': instance.title}
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        log_admin_action(
            self.request.user,
            'update',
            'Product',
            str(instance.id),
            serializer.validated_data
        )

    def perform_destroy(self, instance):
        log_admin_action(
            self.request.user,
            'delete',
            'Product',
            str(instance.id),
            {'title': instance.title}
        )
        instance.delete()


class AdminProductVariantViewSet(viewsets.ModelViewSet):
    """Admin product variant viewset."""
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def perform_create(self, serializer):
        instance = serializer.save()
        log_admin_action(
            self.request.user,
            'create',
            'ProductVariant',
            str(instance.id),
            {'sku': instance.sku}
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        log_admin_action(
            self.request.user,
            'update',
            'ProductVariant',
            str(instance.id),
            serializer.validated_data
        )

    def perform_destroy(self, instance):
        log_admin_action(
            self.request.user,
            'delete',
            'ProductVariant',
            str(instance.id),
            {'sku': instance.sku}
        )
        instance.delete()


class AdminOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin order viewset."""
    queryset = Order.objects.all().prefetch_related('lines')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'payment_status']
    search_fields = ['reference', 'email', 'first_name', 'last_name']

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update order status."""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.ORDER_STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        log_admin_action(
            request.user,
            'update',
            'Order',
            str(order.id),
            {'status': new_status}
        )
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)


class WilayaViewSet(viewsets.ReadOnlyModelViewSet):
    """Wilaya viewset (read-only for public API)."""
    queryset = Wilaya.objects.all()
    serializer_class = WilayaSerializer
    permission_classes = [AllowAny]


class BaladiyaViewSet(viewsets.ReadOnlyModelViewSet):
    """Baladiya viewset (read-only for public API)."""
    queryset = Baladiya.objects.all()
    serializer_class = BaladiyaSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['wilaya']


class AdminAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin audit log viewset."""
    queryset = AuditLog.objects.all().select_related('admin_user')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['action_type', 'model_name', 'admin_user']


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def import_products_csv(request):
    """Import products from CSV."""
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    decoded_file = file.read().decode('utf-8')
    io_string = io.StringIO(decoded_file)
    reader = csv.DictReader(io_string)
    
    imported = 0
    errors = []
    
    for row_num, row in enumerate(reader, start=2):
        try:
            # Create or update product
            product, created = Product.objects.get_or_create(
                slug=row.get('slug', ''),
                defaults={
                    'title': row.get('title', ''),
                    'description': row.get('description', ''),
                    'brand': row.get('brand', ''),
                    'is_active': row.get('is_active', 'true').lower() == 'true'
                }
            )
            
            # Create variant
            variant, _ = ProductVariant.objects.get_or_create(
                sku=row.get('sku', ''),
                defaults={
                    'product': product,
                    'size': row.get('size', ''),
                    'color': row.get('color', ''),
                    'price': Decimal(row.get('price', '0')),
                    'stock_quantity': int(row.get('stock_quantity', '0')),
                    'is_active': row.get('variant_active', 'true').lower() == 'true'
                }
            )
            
            imported += 1
        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")
    
    log_admin_action(
        request.user,
        'import',
        'Product',
        '',
        {'imported': imported, 'errors': len(errors)}
    )
    
    return Response({
        'imported': imported,
        'errors': errors
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def export_orders_csv(request):
    """Export orders to CSV."""
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="orders.csv"'
    
    writer = csv.writer(response)
    writer.writerow([
        'Reference', 'Email', 'Status', 'Total', 'Created At'
    ])
    
    orders = Order.objects.all()
    for order in orders:
        writer.writerow([
            order.reference,
            order.email,
            order.status,
            order.total,
            order.created_at
        ])
    
    log_admin_action(
        request.user,
        'export',
        'Order',
        '',
        {'count': orders.count()}
    )
    
    return response



