import random
from django.core.management.base import BaseCommand
from store.models import Category, Product, ProductVariant, ProductImage

class Command(BaseCommand):
    help = 'Seed database with many fashion products for pagination testing'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database with many products...')
        
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
                    {'name': 'Vestes', 'description': 'Vestes et manteaux élégants', 'image_url': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=600&fit=crop'},
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
                    {'name': 'Pulls', 'description': 'Pulls et sweats confortables', 'image_url': 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=600&fit=crop'},
                ]
            },
            {
                'name': 'Accessoires',
                'description': 'Accessoires de mode',
                'image_url': 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&h=600&fit=crop',
                'subcategories': [
                    {'name': 'Sacs', 'description': 'Sacs à main et sacs à dos', 'image_url': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=600&fit=crop'},
                    {'name': 'Foulards', 'description': 'Foulards et écharpes', 'image_url': 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&h=600&fit=crop'},
                    {'name': 'Chaussures', 'description': 'Chaussures pour tous', 'image_url': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop'},
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
        
        # Fashion images from Unsplash
        fashion_images = {
            'Robes': [
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=800&fit=crop',
            ],
            'Tops & Chemisiers': [
                'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop',
            ],
            'Pantalons': [
                'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
            ],
            'Jupes': [
                'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&h=800&fit=crop',
            ],
            'Vestes': [
                'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&h=800&fit=crop',
            ],
            'Chemises': [
                'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
            ],
            'T-Shirts': [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=800&fit=crop',
            ],
            'Pantalons Homme': [
                'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop',
            ],
            'Pulls': [
                'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
            ],
            'Sacs': [
                'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop',
            ],
            'Foulards': [
                'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop',
            ],
            'Chaussures': [
                'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop',
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop',
            ],
        }
        
        # Product templates
        product_templates = {
            'Robes': [
                ('Robe Midi Élégante', 'Robe midi parfaite pour les occasions spéciales.'),
                ('Robe Longue Bohème', 'Robe longue au style bohème chic.'),
                ('Robe Cocktail Satin', 'Robe cocktail en satin luxueux.'),
                ('Robe d\'Été Fleurie', 'Robe légère avec motifs floraux.'),
                ('Robe de Soirée', 'Robe élégante pour les événements.'),
                ('Robe Casual Confort', 'Robe décontractée pour tous les jours.'),
                ('Robe Portefeuille', 'Robe portefeuille flatteuse.'),
                ('Robe Chemise', 'Robe chemise polyvalente.'),
                ('Robe Trapèze', 'Robe trapèze classique.'),
                ('Robe Moulante', 'Robe ajustée élégante.'),
            ],
            'Tops & Chemisiers': [
                ('Chemisier en Soie', 'Chemisier en soie pure, élégant.'),
                ('Top Dentelle', 'Top en dentelle délicate.'),
                ('Blouse Bohème', 'Blouse style bohème.'),
                ('Chemise Blanche', 'Chemise blanche classique.'),
                ('Top Crop Mode', 'Top crop tendance.'),
                ('Blouse Fleurie', 'Blouse avec imprimé floral.'),
                ('Top Uni Basic', 'Top basique uni.'),
                ('Chemisier Rayé', 'Chemisier rayé marin.'),
            ],
            'Pantalons': [
                ('Pantalon Tailleur', 'Pantalon tailleur élégant.'),
                ('Jean Slim', 'Jean slim confortable.'),
                ('Pantalon Large', 'Pantalon large fluide.'),
                ('Jean Mom', 'Jean mom fit tendance.'),
                ('Pantalon Cargo', 'Pantalon cargo fonctionnel.'),
                ('Legging Sport', 'Legging sportif stretch.'),
            ],
            'Jupes': [
                ('Jupe Midi Plissée', 'Jupe midi plissée élégante.'),
                ('Jupe Courte', 'Jupe courte tendance.'),
                ('Jupe Longue', 'Jupe longue bohème.'),
                ('Jupe Crayon', 'Jupe crayon ajustée.'),
                ('Jupe Patineuse', 'Jupe patineuse évasée.'),
            ],
            'Vestes': [
                ('Veste Blazer', 'Veste blazer professionnelle.'),
                ('Veste en Jean', 'Veste en jean classique.'),
                ('Manteau Long', 'Manteau long élégant.'),
                ('Veste Cuir', 'Veste en simili cuir.'),
                ('Cardigan Long', 'Cardigan long confortable.'),
            ],
            'Chemises': [
                ('Chemise Oxford', 'Chemise Oxford classique.'),
                ('Chemise Lin', 'Chemise en lin léger.'),
                ('Chemise Rayée', 'Chemise rayée élégante.'),
                ('Chemise Denim', 'Chemise en denim robuste.'),
                ('Chemise Flanelle', 'Chemise flanelle douce.'),
                ('Chemise Business', 'Chemise business formelle.'),
            ],
            'T-Shirts': [
                ('T-Shirt Premium', 'T-shirt en coton premium.'),
                ('T-Shirt Basique', 'T-shirt basique uni.'),
                ('T-Shirt Rayé', 'T-shirt rayé marin.'),
                ('T-Shirt Graphique', 'T-shirt avec imprimé.'),
                ('T-Shirt Col V', 'T-shirt col V classique.'),
                ('T-Shirt Henley', 'T-shirt style henley.'),
            ],
            'Pantalons Homme': [
                ('Chino Slim', 'Pantalon chino coupe slim.'),
                ('Jean Straight', 'Jean coupe droite.'),
                ('Jean Skinny', 'Jean skinny moderne.'),
                ('Pantalon Cargo', 'Pantalon cargo utilitaire.'),
                ('Jean Brut', 'Jean denim brut.'),
            ],
            'Pulls': [
                ('Pull Col Rond', 'Pull col rond classique.'),
                ('Pull Col V', 'Pull col V élégant.'),
                ('Sweat Capuche', 'Sweat à capuche confortable.'),
                ('Pull Maille', 'Pull grosse maille.'),
                ('Gilet Boutons', 'Gilet boutonné classique.'),
            ],
            'Sacs': [
                ('Sac à Main Cuir', 'Sac en cuir véritable.'),
                ('Sac Tote', 'Grand sac tote.'),
                ('Sac Bandoulière', 'Sac bandoulière compact.'),
                ('Sac à Dos', 'Sac à dos moderne.'),
                ('Pochette Soirée', 'Pochette élégante.'),
            ],
            'Foulards': [
                ('Foulard Soie', 'Foulard en soie.'),
                ('Écharpe Laine', 'Écharpe en laine.'),
                ('Foulard Imprimé', 'Foulard motifs.'),
            ],
            'Chaussures': [
                ('Baskets Blanches', 'Baskets blanches classiques.'),
                ('Bottines Cuir', 'Bottines en cuir.'),
                ('Escarpins Élégants', 'Escarpins chics.'),
                ('Sandales Été', 'Sandales confortables.'),
            ],
        }
        
        brands = ['Élégance', 'Luxe Paris', 'Urban Style', 'Bohème Chic', 'Classic', 'Modern Wear', 'Style Co']
        colors = ['Noir', 'Blanc', 'Bleu', 'Rouge', 'Vert', 'Beige', 'Gris', 'Rose', 'Marron']
        sizes_clothes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        sizes_nums = ['36', '38', '40', '42', '44', '46']
        
        self.stdout.write('\nCreating products...')
        total_created = 0
        
        for category_name, templates in product_templates.items():
            category = created_categories.get(category_name)
            if not category:
                continue
                
            images = fashion_images.get(category_name, [fashion_images['Robes'][0]])
            
            for idx, (title, description) in enumerate(templates):
                # Create 2-3 variations of each product
                for i in range(random.randint(2, 3)):
                    brand = random.choice(brands)
                    # Add unique identifier to avoid slug collisions
                    suffix = random.choice(['Premium', 'Classic', 'Sport', 'Casual', 'Élite', 'Deluxe', 'Plus'])
                    variant_title = f"{title}" if i == 0 else f"{title} {suffix}"
                    # Add counter to ensure uniqueness
                    variant_title = f"{variant_title} #{total_created + 1}"
                    
                    product = Product.objects.create(
                        title=variant_title,
                        description=f"{description} {random.choice(['Confort optimal.', 'Qualité supérieure.', 'Design moderne.', 'Style intemporel.'])}",
                        brand=brand,
                        is_active=True
                    )
                    
                    product.product_categories.create(category=category)
                    
                    # Create variants with different sizes/colors
                    base_price = random.randint(1500, 8000)
                    has_sale = random.random() < 0.3  # 30% chance of sale
                    
                    # Choose size range
                    sizes = sizes_clothes if category_name not in ['Pantalons', 'Pantalons Homme'] else sizes_nums
                    selected_sizes = random.sample(sizes, random.randint(2, 4))
                    selected_colors = random.sample(colors, random.randint(1, 3))
                    
                    for size in selected_sizes:
                        for color in selected_colors:
                            image = random.choice(images)
                            variant = ProductVariant.objects.create(
                                product=product,
                                sku=f"{product.slug[:10].upper()}-{size[:2]}-{color[:2].upper()}-{random.randint(100, 999)}",
                                size=size,
                                color=color,
                                price=base_price,
                                compare_at_price=int(base_price * 1.3) if has_sale else None,
                                stock_quantity=random.randint(5, 50),
                                low_stock_threshold=5,
                                is_active=True,
                                image_main=image
                            )
                            
                            # Add 1-2 images
                            for img_idx in range(random.randint(1, 2)):
                                ProductImage.objects.create(
                                    variant=variant,
                                    image_url=random.choice(images),
                                    alt_text=f"{product.title} - Image {img_idx + 1}",
                                    position=img_idx
                                )
                    
                    total_created += 1
                    if total_created % 10 == 0:
                        self.stdout.write(f'  ✓ Created {total_created} products...')
        
        # Summary
        total_categories = Category.objects.count()
        total_products = Product.objects.count()
        total_variants = ProductVariant.objects.count()
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ Large seeding completed successfully!'))
        self.stdout.write(self.style.SUCCESS(f'   Categories: {total_categories}'))
        self.stdout.write(self.style.SUCCESS(f'   Products: {total_products}'))
        self.stdout.write(self.style.SUCCESS(f'   Variants: {total_variants}'))

