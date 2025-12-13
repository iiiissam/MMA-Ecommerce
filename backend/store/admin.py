"""
Django admin configuration for store models.
"""

from django.contrib import admin

from .models import (
    AuditLog,
    Baladiya,
    Category,
    Client,
    ClientToken,
    Order,
    OrderLine,
    Product,
    ProductCategory,
    ProductImage,
    ProductVariant,
    Wilaya,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "parent", "is_active", "created_at"]
    list_filter = ["is_active", "created_at"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "brand", "is_active", "created_at"]
    list_filter = ["is_active", "brand", "created_at"]
    search_fields = ["title", "description", "brand"]
    prepopulated_fields = {"slug": ("title",)}


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = [
        "sku",
        "product",
        "size",
        "color",
        "price",
        "stock_quantity",
        "is_active",
    ]
    list_filter = ["is_active", "product"]
    search_fields = ["sku", "product__title"]
    raw_id_fields = ["product"]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ["variant", "position", "image_url"]
    list_filter = ["variant__product"]
    raw_id_fields = ["variant"]


@admin.register(Wilaya)
class WilayaAdmin(admin.ModelAdmin):
    list_display = ["name", "code"]
    search_fields = ["name", "code"]


@admin.register(Baladiya)
class BaladiyaAdmin(admin.ModelAdmin):
    list_display = ["name", "wilaya"]
    list_filter = ["wilaya"]
    search_fields = ["name", "wilaya__name"]


class OrderLineInline(admin.TabularInline):
    model = OrderLine
    extra = 0
    readonly_fields = ["sku_snapshot", "title_snapshot", "price_snapshot", "line_total"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["reference", "name", "phone", "status", "total", "created_at"]
    list_filter = ["status", "payment_status", "wilaya", "created_at"]
    search_fields = ["reference", "name", "phone"]
    readonly_fields = ["reference", "created_at", "updated_at"]
    inlines = [OrderLineInline]
    fieldsets = (
        ("Order Info", {"fields": ("reference", "status", "created_at", "updated_at")}),
        ("Customer", {"fields": ("name", "phone", "address", "wilaya", "baladiya")}),
        ("Pricing", {"fields": ("subtotal", "shipping_cost", "total")}),
        ("Payment", {"fields": ("payment_method", "payment_status")}),
    )


@admin.register(OrderLine)
class OrderLineAdmin(admin.ModelAdmin):
    list_display = ["order", "sku_snapshot", "quantity", "line_total"]
    list_filter = ["order__status"]
    search_fields = ["order__reference", "sku_snapshot"]
    raw_id_fields = ["order", "product_variant"]


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ["admin_user", "action_type", "model_name", "object_id", "timestamp"]
    list_filter = ["action_type", "model_name", "timestamp"]
    search_fields = ["admin_user__username", "model_name", "object_id"]
    readonly_fields = ["timestamp"]
    date_hierarchy = "timestamp"


admin.site.register(ProductCategory)


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = [
        "email",
        "first_name",
        "last_name",
        "phone",
        "is_active",
        "last_login",
        "created_at",
    ]
    list_filter = ["is_active", "created_at"]
    search_fields = ["email", "first_name", "last_name", "phone"]
    readonly_fields = ["created_at", "updated_at", "last_login"]
    fieldsets = (
        (
            "Account Info",
            {"fields": ("email", "is_active", "created_at", "last_login")},
        ),
        ("Personal Info", {"fields": ("first_name", "last_name", "phone")}),
    )


@admin.register(ClientToken)
class ClientTokenAdmin(admin.ModelAdmin):
    list_display = ["client", "token", "created_at"]
    search_fields = ["client__email", "token"]
    readonly_fields = ["token", "created_at"]
