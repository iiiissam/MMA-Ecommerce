"""
Serializers for the store API.
"""

from django.contrib.auth.hashers import check_password, make_password
from rest_framework import serializers

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


class CategorySerializer(serializers.ModelSerializer):
    """Category serializer."""

    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "parent",
            "description",
            "image_url",
            "is_active",
            "children",
            "product_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def get_children(self, obj):
        """Get child categories."""
        children = obj.children.filter(is_active=True)
        return CategorySerializer(children, many=True).data

    def get_product_count(self, obj):
        """Get product count for this category."""
        return obj.category_products.filter(product__is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    """Product image serializer."""

    class Meta:
        model = ProductImage
        fields = ["id", "image_url", "alt_text", "position"]


class ProductVariantSerializer(serializers.ModelSerializer):
    """Product variant serializer."""

    images = ProductImageSerializer(many=True, read_only=True)
    images_data = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=False
    )
    is_in_stock = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()
    price = serializers.DecimalField(
        max_digits=10, decimal_places=2, coerce_to_string=True
    )
    compare_at_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "product",
            "sku",
            "size",
            "color",
            "price",
            "compare_at_price",
            "stock_quantity",
            "low_stock_threshold",
            "barcode",
            "weight",
            "is_active",
            "image_main",
            "images",
            "images_data",
            "is_in_stock",
            "is_low_stock",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def create(self, validated_data):
        """Create variant with images."""
        images_data = validated_data.pop("images_data", [])
        variant = ProductVariant.objects.create(**validated_data)

        # Create images
        for idx, img_data in enumerate(images_data):
            ProductImage.objects.create(
                variant=variant,
                image_url=img_data.get("image_url", ""),
                alt_text=img_data.get("alt_text", ""),
                position=img_data.get("position", idx),
            )

        return variant

    def update(self, instance, validated_data):
        """Update variant with images."""
        images_data = validated_data.pop("images_data", None)

        # Update variant fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update images if provided
        if images_data is not None:
            # Delete existing images
            instance.images.all().delete()
            # Create new images
            for idx, img_data in enumerate(images_data):
                ProductImage.objects.create(
                    variant=instance,
                    image_url=img_data.get("image_url", ""),
                    alt_text=img_data.get("alt_text", ""),
                    position=img_data.get("position", idx),
                )

        return instance


class ProductSerializer(serializers.ModelSerializer):
    """Product serializer for public API."""

    variants = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    min_price = serializers.SerializerMethodField()
    max_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "brand",
            "is_active",
            "variants",
            "categories",
            "min_price",
            "max_price",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def get_variants(self, obj):
        """Get active variants."""
        variants = obj.variants.filter(is_active=True)
        return ProductVariantSerializer(variants, many=True).data

    def get_categories(self, obj):
        """Get categories."""
        categories = obj.product_categories.all()
        return [
            {"id": pc.category.id, "name": pc.category.name, "slug": pc.category.slug}
            for pc in categories
        ]

    def get_min_price(self, obj):
        """Get minimum variant price."""
        variants = obj.variants.filter(is_active=True)
        if variants.exists():
            return str(min(v.price for v in variants))
        return None

    def get_max_price(self, obj):
        """Get maximum variant price."""
        variants = obj.variants.filter(is_active=True)
        if variants.exists():
            return str(max(v.price for v in variants))
        return None


class ProductDetailSerializer(ProductSerializer):
    """Detailed product serializer."""

    pass


class WilayaSerializer(serializers.ModelSerializer):
    """Wilaya serializer."""

    class Meta:
        model = Wilaya
        fields = ["id", "name", "code"]


class BaladiyaSerializer(serializers.ModelSerializer):
    """Baladiya serializer."""

    wilaya_name = serializers.CharField(source="wilaya.name", read_only=True)

    class Meta:
        model = Baladiya
        fields = ["id", "name", "wilaya", "wilaya_name"]


class OrderLineSerializer(serializers.ModelSerializer):
    """Order line serializer."""

    class Meta:
        model = OrderLine
        fields = [
            "id",
            "product_variant",
            "sku_snapshot",
            "title_snapshot",
            "price_snapshot",
            "quantity",
            "line_total",
        ]


class OrderSerializer(serializers.ModelSerializer):
    """Order serializer."""

    lines = OrderLineSerializer(many=True, read_only=True)
    wilaya_name = serializers.CharField(source="wilaya.name", read_only=True)
    baladiya_name = serializers.CharField(source="baladiya.name", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "reference",
            "status",
            "name",
            "phone",
            "address",
            "wilaya",
            "wilaya_name",
            "baladiya",
            "baladiya_name",
            "subtotal",
            "shipping_cost",
            "total",
            "payment_method",
            "payment_status",
            "lines",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["reference", "created_at", "updated_at"]


class CheckoutSerializer(serializers.Serializer):
    """Checkout serializer for guest orders."""

    # Cart items
    items = serializers.ListField(
        child=serializers.DictField(),
        help_text="List of cart items with variant_id and quantity",
    )

    # Customer info
    name = serializers.CharField(max_length=200)
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    wilaya = serializers.IntegerField()
    baladiya = serializers.IntegerField()

    def validate_items(self, value):
        """Validate cart items."""
        if not value:
            raise serializers.ValidationError("Cart cannot be empty.")
        for item in value:
            if "variant_id" not in item or "quantity" not in item:
                raise serializers.ValidationError(
                    "Each item must have variant_id and quantity."
                )
            if item["quantity"] <= 0:
                raise serializers.ValidationError("Quantity must be greater than 0.")
        return value

    def validate_wilaya(self, value):
        """Validate wilaya exists."""
        from .models import Wilaya

        try:
            Wilaya.objects.get(id=value)
        except Wilaya.DoesNotExist:
            raise serializers.ValidationError("Invalid wilaya.")
        return value

    def validate_baladiya(self, value):
        """Validate baladiya exists and belongs to wilaya."""
        from .models import Baladiya

        try:
            baladiya = Baladiya.objects.get(id=value)
            if baladiya.wilaya.id != self.initial_data.get("wilaya"):
                raise serializers.ValidationError(
                    "Baladiya does not belong to selected wilaya."
                )
        except Baladiya.DoesNotExist:
            raise serializers.ValidationError("Invalid baladiya.")
        return value


class AuditLogSerializer(serializers.ModelSerializer):
    """Audit log serializer."""

    admin_user_username = serializers.CharField(
        source="admin_user.username", read_only=True
    )

    class Meta:
        model = AuditLog
        fields = [
            "id",
            "admin_user",
            "admin_user_username",
            "action_type",
            "model_name",
            "object_id",
            "changes",
            "timestamp",
            "ip_address",
        ]
        read_only_fields = ["timestamp"]


# Admin serializers
class AdminProductSerializer(serializers.ModelSerializer):
    """Admin product serializer with full details."""

    variants = ProductVariantSerializer(many=True, read_only=True)
    categories = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "brand",
            "is_active",
            "variants",
            "categories",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def get_categories(self, obj):
        """Get category IDs."""
        return [pc.category.id for pc in obj.product_categories.all()]

    def create(self, validated_data):
        """Create product with categories."""
        categories_data = self.initial_data.get("categories", [])
        product = Product.objects.create(**validated_data)
        for category_id in categories_data:
            category = Category.objects.get(id=category_id)
            ProductCategory.objects.create(product=product, category=category)
        return product

    def update(self, instance, validated_data):
        """Update product with categories."""
        categories_data = self.initial_data.get("categories", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if categories_data is not None:
            # Update categories
            instance.product_categories.all().delete()
            for category_id in categories_data:
                category = Category.objects.get(id=category_id)
                ProductCategory.objects.create(product=instance, category=category)

        return instance


# Client Authentication Serializers
class ClientSerializer(serializers.ModelSerializer):
    """Client serializer for profile display."""

    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Client
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone",
            "created_at",
        ]
        read_only_fields = ["id", "email", "created_at"]


class ClientRegisterSerializer(serializers.Serializer):
    """Serializer for client registration."""

    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    password_confirm = serializers.CharField(min_length=6, write_only=True)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    def validate_email(self, value):
        """Check email is unique."""
        if Client.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("Un compte avec cet email existe déjà.")
        return value.lower()

    def validate(self, data):
        """Check passwords match."""
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Les mots de passe ne correspondent pas."}
            )
        return data

    def create(self, validated_data):
        """Create new client with hashed password."""
        validated_data.pop("password_confirm")
        validated_data["password"] = make_password(validated_data["password"])
        client = Client.objects.create(**validated_data)
        # Create auth token
        ClientToken.objects.create(client=client)
        return client


class ClientLoginSerializer(serializers.Serializer):
    """Serializer for client login."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """Validate credentials."""
        email = data.get("email", "").lower()
        password = data.get("password", "")

        try:
            client = Client.objects.get(email=email)
        except Client.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "Email ou mot de passe incorrect."}
            )

        if not check_password(password, client.password):
            raise serializers.ValidationError(
                {"email": "Email ou mot de passe incorrect."}
            )

        if not client.is_active:
            raise serializers.ValidationError({"email": "Ce compte a été désactivé."})

        data["client"] = client
        return data


class ClientUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating client profile."""

    class Meta:
        model = Client
        fields = ["first_name", "last_name", "phone"]


class ClientPasswordChangeSerializer(serializers.Serializer):
    """Serializer for changing client password."""

    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(min_length=6, write_only=True)
    new_password_confirm = serializers.CharField(min_length=6, write_only=True)

    def validate(self, data):
        """Validate password change."""
        if data["new_password"] != data["new_password_confirm"]:
            raise serializers.ValidationError(
                {"new_password_confirm": "Les mots de passe ne correspondent pas."}
            )
        return data


class AdminClientSerializer(serializers.ModelSerializer):
    """Admin serializer for viewing clients."""

    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Client
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone",
            "is_active",
            "last_login",
            "created_at",
        ]
        read_only_fields = ["id", "email", "created_at", "last_login"]
