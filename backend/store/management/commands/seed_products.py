import random
from django.core.management.base import BaseCommand
from store.models import Category, Product, ProductVariant, ProductImage

class Command(BaseCommand):
    help = 'Seed database with fashion products and categories'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database with products and categories...')
        
        # Clear existing data
        self.stdout.write('Clearing existing products and categories...')
        ProductImage.objects.all().delete()
        ProductVariant.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        
        # Create categories
        self.stdout.write('Creating categories...')
        categories_data = [
            {
                'name': 'Femmes',
                'description': 'Collection pour femmes élégantes',
                'image_url': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop',
                'subcategories': [
                    {'name': 'Robes', 'description': 'Robes élégantes pour toutes occasions', 'image_url': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop'},
                    {'name': 'Tops & Chemisiers', 'description': 'Hauts tendance et intemporels', 'image_url': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=600&fit=crop'},
                    {'name': 'Pantalons', 'description': 'Pantalons confortables et stylés', 'image_url': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=600&fit=crop'},
                    {'name': 'Jupes', 'description': 'Jupes pour tous les styles', 'image_url': 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&h=600&fit=crop'},
                ]
            },
            {
                'name': 'Hommes',
                'description': 'Collection masculine raffinée',
                'image_url': 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&h=600&fit=crop',
                'subcategories': [
                    {'name': 'Chemises', 'description': 'Chemises élégantes pour homme', 'image_url': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=600&fit=crop'},
                    {'name': 'T-Shirts', 'description': 'T-shirts confortables et stylés', 'image_url': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop'},
                    {'name': 'Pantalons Homme', 'description': 'Pantalons et jeans pour homme', 'image_url': 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=600&fit=crop'},
                ]
            },
            {
                'name': 'Accessoires',
                'description': 'Accessoires de mode',
                'image_url': 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&h=600&fit=crop',
                'subcategories': [
                    {'name': 'Sacs', 'description': 'Sacs à main et sacs à dos', 'image_url': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=600&fit=crop'},
                    {'name': 'Foulards', 'description': 'Foulards et écharpes', 'image_url': 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&h=600&fit=crop'},
                ]
            },
        ]
        
        created_categories = {}
        
        for cat_data in categories_data:
            parent_cat = Category.objects.create(
                name=cat_data['name'],
                description=cat_data['description'],
                image_url=cat_data['image_url'],
                is_active=True
            )
            created_categories[cat_data['name']] = parent_cat
            self.stdout.write(f'  ✓ Created category: {parent_cat.name}')
            
            for subcat_data in cat_data.get('subcategories', []):
                subcat = Category.objects.create(
                    name=subcat_data['name'],
                    description=subcat_data['description'],
                    image_url=subcat_data['image_url'],
                    parent=parent_cat,
                    is_active=True
                )
                created_categories[subcat_data['name']] = subcat
                self.stdout.write(f'    ✓ Created subcategory: {subcat.name}')
        
        # Create products with real Unsplash images
        self.stdout.write('\nCreating products...')
        
        products_data = [
            # Robes
            {
                'title': 'Robe Midi Élégante',
                'description': 'Robe midi parfaite pour les occasions spéciales. Coupe flatteuse et tissu de qualité premium.',
                'category': 'Robes',
                'brand': 'Élégance',
                'images': [
                    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': 'S', 'color': 'Noir', 'price': 4500, 'compare_at': 6000, 'stock': 10},
                    {'size': 'M', 'color': 'Noir', 'price': 4500, 'compare_at': 6000, 'stock': 15},
                    {'size': 'L', 'color': 'Noir', 'price': 4500, 'compare_at': 6000, 'stock': 8},
                    {'size': 'S', 'color': 'Bleu Marine', 'price': 4500, 'compare_at': 6000, 'stock': 12},
                    {'size': 'M', 'color': 'Bleu Marine', 'price': 4500, 'compare_at': 6000, 'stock': 10},
                ]
            },
            {
                'title': 'Robe Longue Bohème',
                'description': 'Robe longue au style bohème chic. Idéale pour les sorties estivales.',
                'category': 'Robes',
                'brand': 'Bohème Chic',
                'images': [
                    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': 'S', 'color': 'Beige', 'price': 5200, 'compare_at': None, 'stock': 8},
                    {'size': 'M', 'color': 'Beige', 'price': 5200, 'compare_at': None, 'stock': 12},
                    {'size': 'L', 'color': 'Beige', 'price': 5200, 'compare_at': None, 'stock': 6},
                ]
            },
            {
                'title': 'Robe Cocktail Satin',
                'description': 'Robe cocktail en satin luxueux. Parfaite pour les événements élégants.',
                'category': 'Robes',
                'brand': 'Luxe Paris',
                'images': [
                    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': 'S', 'color': 'Rouge', 'price': 6800, 'compare_at': 8500, 'stock': 5},
                    {'size': 'M', 'color': 'Rouge', 'price': 6800, 'compare_at': 8500, 'stock': 7},
                    {'size': 'S', 'color': 'Émeraude', 'price': 6800, 'compare_at': 8500, 'stock': 4},
                ]
            },
            
            # Tops & Chemisiers
            {
                'title': 'Chemisier en Soie Classique',
                'description': 'Chemisier en soie pure, élégant et intemporel. Idéal pour le bureau.',
                'category': 'Tops & Chemisiers',
                'brand': 'Élégance',
                'images': [
                    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': 'S', 'color': 'Blanc', 'price': 3200, 'compare_at': None, 'stock': 20},
                    {'size': 'M', 'color': 'Blanc', 'price': 3200, 'compare_at': None, 'stock': 25},
                    {'size': 'L', 'color': 'Blanc', 'price': 3200, 'compare_at': None, 'stock': 15},
                    {'size': 'S', 'color': 'Crème', 'price': 3200, 'compare_at': None, 'stock': 18},
                ]
            },
            {
                'title': 'Top Dentelle Romantique',
                'description': 'Top en dentelle délicate, parfait pour les occasions romantiques.',
                'category': 'Tops & Chemisiers',
                'brand': 'Romance',
                'images': [
                    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': 'S', 'color': 'Rose Poudré', 'price': 2800, 'compare_at': 3500, 'stock': 12},
                    {'size': 'M', 'color': 'Rose Poudré', 'price': 2800, 'compare_at': 3500, 'stock': 15},
                ]
            },
            
            # Pantalons Femme
            {
                'title': 'Pantalon Tailleur Slim',
                'description': 'Pantalon tailleur coupe slim, parfait pour un look professionnel.',
                'category': 'Pantalons',
                'brand': 'Business',
                'images': [
                    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': '36', 'color': 'Noir', 'price': 3800, 'compare_at': None, 'stock': 10},
                    {'size': '38', 'color': 'Noir', 'price': 3800, 'compare_at': None, 'stock': 15},
                    {'size': '40', 'color': 'Noir', 'price': 3800, 'compare_at': None, 'stock': 12},
                    {'size': '38', 'color': 'Gris', 'price': 3800, 'compare_at': None, 'stock': 8},
                ]
            },
            {
                'title': 'Jean Slim Stretch',
                'description': 'Jean slim confortable avec stretch pour un maximum de confort.',
                'category': 'Pantalons',
                'brand': 'Denim Co',
                'images': [
                    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': '36', 'color': 'Bleu Foncé', 'price': 3200, 'compare_at': 4000, 'stock': 20},
                    {'size': '38', 'color': 'Bleu Foncé', 'price': 3200, 'compare_at': 4000, 'stock': 18},
                    {'size': '40', 'color': 'Bleu Foncé', 'price': 3200, 'compare_at': 4000, 'stock': 15},
                ]
            },
            
            # Jupes
            {
                'title': 'Jupe Midi Plissée',
                'description': 'Jupe midi plissée élégante, parfaite pour toutes les saisons.',
                'category': 'Jupes',
                'brand': 'Élégance',
                'images': [
                    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': 'S', 'color': 'Noir', 'price': 2900, 'compare_at': None, 'stock': 12},
                    {'size': 'M', 'color': 'Noir', 'price': 2900, 'compare_at': None, 'stock': 15},
                    {'size': 'L', 'color': 'Noir', 'price': 2900, 'compare_at': None, 'stock': 10},
                    {'size': 'M', 'color': 'Bordeaux', 'price': 2900, 'compare_at': None, 'stock': 8},
                ]
            },
            
            # Chemises Homme
            {
                'title': 'Chemise Oxford Classique',
                'description': 'Chemise Oxford en coton, intemporelle et polyvalente.',
                'category': 'Chemises',
                'brand': 'Gentleman',
                'images': [
                    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': 'M', 'color': 'Blanc', 'price': 3500, 'compare_at': None, 'stock': 15},
                    {'size': 'L', 'color': 'Blanc', 'price': 3500, 'compare_at': None, 'stock': 18},
                    {'size': 'XL', 'color': 'Blanc', 'price': 3500, 'compare_at': None, 'stock': 12},
                    {'size': 'L', 'color': 'Bleu Ciel', 'price': 3500, 'compare_at': None, 'stock': 10},
                ]
            },
            {
                'title': 'Chemise Lin Été',
                'description': 'Chemise en lin léger, idéale pour les journées chaudes.',
                'category': 'Chemises',
                'brand': 'Summer Style',
                'images': [
                    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': 'M', 'color': 'Beige', 'price': 3200, 'compare_at': 4000, 'stock': 12},
                    {'size': 'L', 'color': 'Beige', 'price': 3200, 'compare_at': 4000, 'stock': 10},
                    {'size': 'M', 'color': 'Blanc', 'price': 3200, 'compare_at': 4000, 'stock': 15},
                ]
            },
            
            # T-Shirts Homme
            {
                'title': 'T-Shirt Premium Coton',
                'description': 'T-shirt en coton premium, confortable et durable.',
                'category': 'T-Shirts',
                'brand': 'Basics',
                'images': [
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': 'M', 'color': 'Noir', 'price': 1800, 'compare_at': None, 'stock': 30},
                    {'size': 'L', 'color': 'Noir', 'price': 1800, 'compare_at': None, 'stock': 35},
                    {'size': 'XL', 'color': 'Noir', 'price': 1800, 'compare_at': None, 'stock': 25},
                    {'size': 'M', 'color': 'Blanc', 'price': 1800, 'compare_at': None, 'stock': 28},
                    {'size': 'L', 'color': 'Blanc', 'price': 1800, 'compare_at': None, 'stock': 32},
                    {'size': 'M', 'color': 'Gris', 'price': 1800, 'compare_at': None, 'stock': 20},
                ]
            },
            
            # Pantalons Homme
            {
                'title': 'Chino Slim Fit',
                'description': 'Pantalon chino coupe slim, élégant et confortable.',
                'category': 'Pantalons Homme',
                'brand': 'Urban Style',
                'images': [
                    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': '40', 'color': 'Beige', 'price': 3900, 'compare_at': None, 'stock': 15},
                    {'size': '42', 'color': 'Beige', 'price': 3900, 'compare_at': None, 'stock': 18},
                    {'size': '44', 'color': 'Beige', 'price': 3900, 'compare_at': None, 'stock': 12},
                    {'size': '42', 'color': 'Noir', 'price': 3900, 'compare_at': None, 'stock': 20},
                ]
            },
            {
                'title': 'Jean Straight Regular',
                'description': 'Jean coupe droite classique en denim robuste.',
                'category': 'Pantalons Homme',
                'brand': 'Denim Co',
                'images': [
                    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': '40', 'color': 'Bleu Brut', 'price': 3500, 'compare_at': 4200, 'stock': 22},
                    {'size': '42', 'color': 'Bleu Brut', 'price': 3500, 'compare_at': 4200, 'stock': 25},
                    {'size': '44', 'color': 'Bleu Brut', 'price': 3500, 'compare_at': 4200, 'stock': 18},
                ]
            },
            
            # Accessoires
            {
                'title': 'Sac à Main Cuir',
                'description': 'Sac à main en cuir véritable, élégant et spacieux.',
                'category': 'Sacs',
                'brand': 'Luxe Bags',
                'images': [
                    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': 'Unique', 'color': 'Noir', 'price': 8500, 'compare_at': None, 'stock': 8},
                    {'size': 'Unique', 'color': 'Marron', 'price': 8500, 'compare_at': None, 'stock': 6},
                    {'size': 'Unique', 'color': 'Beige', 'price': 8500, 'compare_at': None, 'stock': 5},
                ]
            },
            {
                'title': 'Foulard Soie Imprimé',
                'description': 'Foulard en soie avec motifs élégants.',
                'category': 'Foulards',
                'brand': 'Silk Touch',
                'images': [
                    'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop',
                ],
                'variants': [
                    {'size': 'Unique', 'color': 'Multicolore', 'price': 1500, 'compare_at': 2000, 'stock': 15},
                    {'size': 'Unique', 'color': 'Bleu', 'price': 1500, 'compare_at': 2000, 'stock': 12},
                ]
            },
        ]
        
        for prod_data in products_data:
            # Create product
            product = Product.objects.create(
                title=prod_data['title'],
                description=prod_data['description'],
                brand=prod_data.get('brand', 'Élégance Moderne'),
                is_active=True
            )
            
            # Add category
            category = created_categories.get(prod_data['category'])
            if category:
                product.product_categories.create(category=category)
            
            # Create variants
            for idx, variant_data in enumerate(prod_data['variants']):
                variant = ProductVariant.objects.create(
                    product=product,
                    sku=f"{product.slug[:10].upper()}-{variant_data['size'][:2]}-{variant_data['color'][:2].upper()}-{random.randint(100, 999)}",
                    size=variant_data['size'],
                    color=variant_data['color'],
                    price=variant_data['price'],
                    compare_at_price=variant_data.get('compare_at'),
                    stock_quantity=variant_data['stock'],
                    low_stock_threshold=5,
                    is_active=True,
                    image_main=prod_data['images'][0] if prod_data['images'] else None
                )
                
                # Add additional images
                for img_idx, img_url in enumerate(prod_data['images']):
                    ProductImage.objects.create(
                        variant=variant,
                        image_url=img_url,
                        alt_text=f"{product.title} - Image {img_idx + 1}",
                        position=img_idx
                    )
            
            self.stdout.write(f'  ✓ Created product: {product.title} with {len(prod_data["variants"])} variants')
        
        # Summary
        total_categories = Category.objects.count()
        total_products = Product.objects.count()
        total_variants = ProductVariant.objects.count()
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ Seeding completed successfully!'))
        self.stdout.write(self.style.SUCCESS(f'   Categories: {total_categories}'))
        self.stdout.write(self.style.SUCCESS(f'   Products: {total_products}'))
        self.stdout.write(self.style.SUCCESS(f'   Variants: {total_variants}'))
