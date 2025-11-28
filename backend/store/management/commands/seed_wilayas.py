"""
Management command to seed Wilayas and Baladiyas from CSV file.
Usage: python manage.py seed_wilayas /path/to/worldcities.csv
"""
import csv
from django.core.management.base import BaseCommand, CommandError
from store.models import Wilaya, Baladiya


class Command(BaseCommand):
    help = 'Seed Wilayas and Baladiyas from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        
        try:
            # Try different encodings
            encodings = ['utf-8-sig', 'utf-8', 'latin-1']
            file_content = None
            
            for encoding in encodings:
                try:
                    with open(csv_file, 'r', encoding=encoding) as f:
                        file_content = f.read()
                    break
                except UnicodeDecodeError:
                    continue
            
            if file_content is None:
                raise CommandError(f'Could not read CSV file with any encoding: {csv_file}')
            
            # Parse CSV
            import io
            reader = csv.DictReader(io.StringIO(file_content))
            
            # Check if required columns exist
            if not reader.fieldnames:
                raise CommandError('CSV file appears to be empty or invalid')
            
            required_fields = ['city_ascii', 'admin_name']
            for field in required_fields:
                if field not in reader.fieldnames:
                    raise CommandError(f'Required column "{field}" not found in CSV. Found columns: {reader.fieldnames}')
            
            wilaya_cache = {}
            created_wilayas = 0
            created_baladiyas = 0
            
            for row in reader:
                if not row.get('admin_name') or not row.get('city_ascii'):
                    continue  # Skip empty rows
                
                wilaya_name = row['admin_name'].strip()
                baladiya_name = row['city_ascii'].strip()
                
                if not wilaya_name or not baladiya_name:
                    continue  # Skip rows with empty values
                
                # Get or create Wilaya
                if wilaya_name not in wilaya_cache:
                    wilaya, created = Wilaya.objects.get_or_create(
                        name=wilaya_name,
                        defaults={'name': wilaya_name}
                    )
                    wilaya_cache[wilaya_name] = wilaya
                    if created:
                        created_wilayas += 1
                else:
                    wilaya = wilaya_cache[wilaya_name]
                
                # Create Baladiya
                baladiya, created = Baladiya.objects.get_or_create(
                    name=baladiya_name,
                    wilaya=wilaya,
                    defaults={'name': baladiya_name, 'wilaya': wilaya}
                )
                if created:
                    created_baladiyas += 1
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created {created_wilayas} wilayas and {created_baladiyas} baladiyas'
                )
            )
                
        except FileNotFoundError:
            raise CommandError(f'CSV file not found: {csv_file}')
        except Exception as e:
            import traceback
            raise CommandError(f'Error processing CSV file: {e}\n{traceback.format_exc()}')

