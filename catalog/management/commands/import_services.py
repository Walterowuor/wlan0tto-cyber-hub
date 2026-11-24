import json
import re
from decimal import Decimal, InvalidOperation
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from catalog.models import Service


class Command(BaseCommand):
    help = 'Import services from data/services.json into the database.'

    def add_arguments(self, parser):
        parser.add_argument('--file', default=str(Path(settings.BASE_DIR) / 'data' / 'services.json'))
        parser.add_argument('--clear', action='store_true', help='Delete existing services first')

    def handle(self, *args, **options):
        if options['clear']:
            Service.objects.all().delete()

        path = Path(options['file'])
        data = json.loads(path.read_text())
        created = 0
        for i, item in enumerate(data.get('services', [])):
            raw_value = item.get('value', '')
            # Legacy format: "Name - KSh10.00/page" -> name "Name", unit "/page"
            name = raw_value
            unit = ''
            m = re.match(r'^(.*?)\s*-\s*KSh[\d.,]+(/\S*)?$', raw_value)
            if m:
                name = m.group(1).strip()
                unit = m.group(2) or ''
            try:
                price = Decimal(str(item.get('price', '0')))
            except InvalidOperation:
                price = Decimal('0')
            Service.objects.update_or_create(
                name=name,
                defaults={
                    'unit': unit,
                    'price': price,
                    'category': item.get('category', 'documents'),
                    'position': i,
                },
            )
            created += 1
        self.stdout.write(self.style.SUCCESS(f'Imported {created} services.'))
