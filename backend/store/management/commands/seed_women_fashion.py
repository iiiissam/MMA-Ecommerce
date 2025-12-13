import random

from django.core.management.base import BaseCommand

from store.models import (Category, Order, OrderLine, Product, ProductImage,
                          ProductVariant)


class Command(BaseCommand):
    help = "Seed database with women fashion products"

    def handle(self, *args, **options):
        self.stdout.write("🧹 Emptying database...")

        # Clear all existing data
        OrderLine.objects.all().delete()
        Order.objects.all().delete()
        ProductImage.objects.all().delete()
        ProductVariant.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()

        self.stdout.write(self.style.SUCCESS("✅ Database cleared!"))
        self.stdout.write("")
        self.stdout.write("👗 Seeding women fashion products...")

        # Create main category
        women = Category.objects.create(
            name="Femmes",
            description="Collection complète de mode féminine",
            image_url="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop",
            is_active=True,
        )
        self.stdout.write(f"  ✓ Created: {women.name}")

        # Subcategories with real Unsplash images
        categories_data = {
            "Robes": {
                "desc": "Robes élégantes pour toutes occasions",
                "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop",
                "products": [
                    {
                        "title": "Robe Midi Fleurie",
                        "desc": "Robe midi avec motifs floraux délicats, parfaite pour le printemps.",
                        "brand": "Élégance",
                        "images": [
                            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
                            "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&h=800&fit=crop",
                        ],
                        "price": 4500,
                    },
                    {
                        "title": "Robe Longue Bohème",
                        "desc": "Robe longue fluide au style bohème chic.",
                        "brand": "Bohème Chic",
                        "images": [
                            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop",
                            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
                        ],
                        "price": 5200,
                    },
                    {
                        "title": "Robe de Soirée Noire",
                        "desc": "Robe élégante pour vos soirées spéciales.",
                        "brand": "Luxe Paris",
                        "images": [
                            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop",
                            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=800&fit=crop",
                        ],
                        "price": 6800,
                        "sale": True,
                    },
                    {
                        "title": "Robe d'Été Légère",
                        "desc": "Robe légère et confortable pour les journées chaudes.",
                        "brand": "Summer Style",
                        "images": [
                            "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop",
                            "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=600&h=800&fit=crop",
                        ],
                        "price": 3200,
                    },
                    {
                        "title": "Robe Chemise Rayée",
                        "desc": "Robe chemise décontractée avec rayures marines.",
                        "brand": "Casual Wear",
                        "images": [
                            "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&h=800&fit=crop",
                        ],
                        "price": 3800,
                    },
                    {
                        "title": "Robe Cocktail Satin",
                        "desc": "Robe cocktail en satin luxueux.",
                        "brand": "Luxe Paris",
                        "images": [
                            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
                        ],
                        "price": 7500,
                        "sale": True,
                    },
                ],
            },
            "Tops & Chemisiers": {
                "desc": "Hauts tendance et intemporels",
                "image": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=600&fit=crop",
                "products": [
                    {
                        "title": "Chemisier Blanc Classique",
                        "desc": "Chemisier blanc intemporel, essentiel de votre garde-robe.",
                        "brand": "Classic",
                        "images": [
                            "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&h=800&fit=crop",
                            "https://images.unsplash.com/photo-1604575396711-e7d24fce1d29?w=600&h=800&fit=crop",
                        ],
                        "price": 2800,
                    },
                    {
                        "title": "Top en Dentelle",
                        "desc": "Top élégant en dentelle fine.",
                        "brand": "Élégance",
                        "images": [
                            "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop",
                        ],
                        "price": 3200,
                    },
                    {
                        "title": "Blouse Satinée",
                        "desc": "Blouse en satin doux au toucher.",
                        "brand": "Luxe Paris",
                        "images": [
                            "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop",
                        ],
                        "price": 3500,
                        "sale": True,
                    },
                    {
                        "title": "T-Shirt Basique Premium",
                        "desc": "T-shirt en coton premium, coupe parfaite.",
                        "brand": "Essential",
                        "images": [
                            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
                        ],
                        "price": 1500,
                    },
                    {
                        "title": "Blouse Fleurie Printanière",
                        "desc": "Blouse légère avec imprimé floral.",
                        "brand": "Bohème Chic",
                        "images": [
                            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop",
                        ],
                        "price": 2900,
                    },
                ],
            },
            "Pantalons": {
                "desc": "Pantalons confortables et stylés",
                "image": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=600&fit=crop",
                "products": [
                    {
                        "title": "Jean Slim Taille Haute",
                        "desc": "Jean slim stretch taille haute, très confortable.",
                        "brand": "Denim Co",
                        "images": [
                            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop",
                            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
                        ],
                        "price": 4200,
                    },
                    {
                        "title": "Pantalon Palazzo",
                        "desc": "Pantalon large fluide, très élégant.",
                        "brand": "Élégance",
                        "images": [
                            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop",
                        ],
                        "price": 3800,
                    },
                    {
                        "title": "Jean Mom Vintage",
                        "desc": "Jean mom fit style vintage des années 90.",
                        "brand": "Retro Style",
                        "images": [
                            "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&h=800&fit=crop",
                        ],
                        "price": 3500,
                        "sale": True,
                    },
                    {
                        "title": "Pantalon Tailleur",
                        "desc": "Pantalon tailleur coupe droite pour le bureau.",
                        "brand": "Business Chic",
                        "images": [
                            "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop",
                        ],
                        "price": 4500,
                    },
                ],
            },
            "Jupes": {
                "desc": "Jupes pour tous les styles",
                "image": "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&h=600&fit=crop",
                "products": [
                    {
                        "title": "Jupe Midi Plissée",
                        "desc": "Jupe midi plissée élégante et féminine.",
                        "brand": "Élégance",
                        "images": [
                            "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop",
                        ],
                        "price": 3200,
                    },
                    {
                        "title": "Jupe Crayon Noire",
                        "desc": "Jupe crayon classique pour le bureau.",
                        "brand": "Business Chic",
                        "images": [
                            "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&h=800&fit=crop",
                        ],
                        "price": 2800,
                    },
                    {
                        "title": "Jupe Longue Bohème",
                        "desc": "Jupe longue fluide au style bohème.",
                        "brand": "Bohème Chic",
                        "images": [
                            "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=600&h=800&fit=crop",
                        ],
                        "price": 3500,
                        "sale": True,
                    },
                    {
                        "title": "Jupe en Jean",
                        "desc": "Jupe en jean décontractée.",
                        "brand": "Denim Co",
                        "images": [
                            "https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=600&h=800&fit=crop",
                        ],
                        "price": 2500,
                    },
                ],
            },
            "Vestes & Manteaux": {
                "desc": "Vestes et manteaux élégants",
                "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=600&fit=crop",
                "products": [
                    {
                        "title": "Blazer Oversize",
                        "desc": "Blazer oversize tendance et polyvalent.",
                        "brand": "Modern Wear",
                        "images": [
                            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
                            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
                        ],
                        "price": 5500,
                    },
                    {
                        "title": "Veste en Jean Classique",
                        "desc": "Veste en jean indémodable.",
                        "brand": "Denim Co",
                        "images": [
                            "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&h=800&fit=crop",
                        ],
                        "price": 4200,
                    },
                    {
                        "title": "Trench Coat Beige",
                        "desc": "Trench coat élégant pour la mi-saison.",
                        "brand": "Classic",
                        "images": [
                            "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop",
                        ],
                        "price": 7800,
                        "sale": True,
                    },
                    {
                        "title": "Manteau Long Laine",
                        "desc": "Manteau long en laine pour l'hiver.",
                        "brand": "Winter Luxe",
                        "images": [
                            "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop",
                        ],
                        "price": 9500,
                    },
                ],
            },
            "Accessoires": {
                "desc": "Accessoires de mode",
                "image": "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&h=600&fit=crop",
                "products": [
                    {
                        "title": "Sac à Main Cuir",
                        "desc": "Sac à main en cuir véritable.",
                        "brand": "Luxe Paris",
                        "images": [
                            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop",
                            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop",
                        ],
                        "price": 8500,
                    },
                    {
                        "title": "Foulard en Soie",
                        "desc": "Foulard en soie aux motifs raffinés.",
                        "brand": "Élégance",
                        "images": [
                            "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop",
                        ],
                        "price": 2200,
                    },
                    {
                        "title": "Ceinture Large",
                        "desc": "Ceinture large en cuir pour marquer la taille.",
                        "brand": "Classic",
                        "images": [
                            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
                        ],
                        "price": 1800,
                        "sale": True,
                    },
                    {
                        "title": "Chapeau de Paille",
                        "desc": "Chapeau de paille élégant pour l'été.",
                        "brand": "Summer Style",
                        "images": [
                            "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=800&fit=crop",
                        ],
                        "price": 1500,
                    },
                    {
                        "title": "Lunettes de Soleil",
                        "desc": "Lunettes de soleil tendance.",
                        "brand": "Modern Wear",
                        "images": [
                            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop",
                        ],
                        "price": 2500,
                    },
                ],
            },
        }

        colors = ["Noir", "Blanc", "Beige", "Rose", "Bleu Marine", "Bordeaux"]
        sizes = ["XS", "S", "M", "L", "XL"]

        total_products = 0
        total_variants = 0

        for cat_name, cat_data in categories_data.items():
            # Create subcategory
            subcat = Category.objects.create(
                name=cat_name,
                description=cat_data["desc"],
                image_url=cat_data["image"],
                parent=women,
                is_active=True,
            )
            self.stdout.write(f"  ✓ Created subcategory: {cat_name}")

            # Create products
            for prod_data in cat_data["products"]:
                product = Product.objects.create(
                    title=prod_data["title"],
                    description=prod_data["desc"],
                    brand=prod_data["brand"],
                    is_active=True,
                )
                product.product_categories.create(category=subcat)
                total_products += 1

                # Create variants
                base_price = prod_data["price"]
                has_sale = prod_data.get("sale", False)
                selected_colors = random.sample(colors, random.randint(2, 4))

                for size in sizes:
                    for color in selected_colors:
                        variant = ProductVariant.objects.create(
                            product=product,
                            sku=f"{product.slug[:8].upper()}-{size}-{color[:3].upper()}-{random.randint(100, 999)}",
                            size=size,
                            color=color,
                            price=base_price,
                            compare_at_price=(
                                int(base_price * 1.25) if has_sale else None
                            ),
                            stock_quantity=random.randint(10, 50),
                            low_stock_threshold=5,
                            is_active=True,
                            image_main=prod_data["images"][0],
                        )
                        total_variants += 1

                        # Add additional images
                        for idx, img_url in enumerate(prod_data["images"]):
                            ProductImage.objects.create(
                                variant=variant,
                                image_url=img_url,
                                alt_text=f"{product.title} - {color} - Image {idx + 1}",
                                position=idx,
                            )

                self.stdout.write(f'    ✓ {prod_data["title"]}')

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("=" * 50))
        self.stdout.write(self.style.SUCCESS("✅ Database seeded successfully!"))
        self.stdout.write(
            self.style.SUCCESS(f"   📁 Categories: {Category.objects.count()}")
        )
        self.stdout.write(self.style.SUCCESS(f"   👗 Products: {total_products}"))
        self.stdout.write(self.style.SUCCESS(f"   🏷️  Variants: {total_variants}"))
        self.stdout.write(self.style.SUCCESS("=" * 50))
