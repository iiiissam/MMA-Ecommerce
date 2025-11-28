# Entity Relationship Diagram

## Database Schema

```
┌──────────────┐
│   Category   │
├──────────────┤
│ id (PK)      │
│ name         │
│ slug (UK)    │
│ parent (FK)  │──┐
│ description  │  │
│ image_url    │  │
│ is_active    │  │
│ created_at   │  │
│ updated_at   │  │
└──────────────┘  │
                  │
                  │ (self-reference)
                  │
┌──────────────┐  │
│   Product    │  │
├──────────────┤  │
│ id (PK)      │  │
│ title        │  │
│ slug (UK)    │  │
│ description  │  │
│ brand        │  │
│ tax_rate     │  │
│ is_active    │  │
│ created_at   │  │
│ updated_at   │  │
└──────┬───────┘  │
       │          │
       │          │
       │          │
┌──────┴───────┐  │
│ProductCategory│ │
├──────────────┤  │
│ id (PK)      │  │
│ product (FK) │──┘
│ category(FK) │──┐
└──────────────┘  │
                  │
┌──────────────┐  │
│ProductVariant│  │
├──────────────┤  │
│ id (PK)      │  │
│ product (FK) │──┘
│ sku (UK)     │
│ size         │
│ color        │
│ price        │
│ compare_at   │
│ stock_qty    │
│ low_threshold│
│ barcode      │
│ weight       │
│ is_active    │
│ image_main   │
│ created_at   │
│ updated_at   │
└──────┬───────┘
       │
       │
┌──────┴───────┐
│ProductImage  │
├──────────────┤
│ id (PK)      │
│ variant (FK) │
│ image_url    │
│ alt_text     │
│ position     │
└──────────────┘

┌──────────────┐
│  Promotion   │
├──────────────┤
│ id (PK)      │
│ code (UK)    │
│ type         │
│ value        │
│ start_date   │
│ end_date     │
│ usage_limit  │
│ usage_count  │
│ applies_to   │
│ is_active    │
│ created_at   │
│ updated_at   │
└──────┬───────┘
       │
       │
┌──────┴───────┐
│    Order    │
├──────────────┤
│ id (PK)     │
│ reference(UK)│
│ status      │
│ email       │
│ first_name  │
│ last_name   │
│ phone       │
│ shipping_addr│
│ billing_addr│
│ subtotal    │
│ discount    │
│ shipping    │
│ tax         │
│ total       │
│ payment_method│
│ payment_status│
│ promotion(FK)│
│ promotion_code│
│ created_at  │
│ updated_at  │
└──────┬───────┘
       │
       │
┌──────┴───────┐
│  OrderLine  │
├──────────────┤
│ id (PK)     │
│ order (FK)  │
│ variant(FK) │
│ sku_snapshot│
│ title_snapshot│
│ price_snapshot│
│ quantity    │
│ line_total  │
└──────────────┘

┌──────────────┐
│  AuditLog    │
├──────────────┤
│ id (PK)      │
│ admin_user(FK)│
│ action_type  │
│ model_name   │
│ object_id    │
│ changes (JSON)│
│ timestamp    │
│ ip_address   │
└──────────────┘
```

## Relationships

1. **Category** → **Category** (self-reference for parent-child hierarchy)
2. **Product** ↔ **Category** (many-to-many via ProductCategory)
3. **Product** → **ProductVariant** (one-to-many)
4. **ProductVariant** → **ProductImage** (one-to-many)
5. **Promotion** → **Order** (one-to-many, optional)
6. **Order** → **OrderLine** (one-to-many)
7. **ProductVariant** → **OrderLine** (one-to-many, via snapshot)
8. **User** → **AuditLog** (one-to-many)

## Indexes

- `Category.slug` (unique)
- `Product.slug` (unique)
- `ProductVariant.sku` (unique)
- `Order.reference` (unique)
- `Promotion.code` (unique)
- `Order.email`, `Order.status`, `Order.created_at`
- `AuditLog.timestamp`, `AuditLog.admin_user`

