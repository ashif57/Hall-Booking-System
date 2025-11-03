from django.core.management.base import BaseCommand
from hall_api.models import HallMaster

class Command(BaseCommand):
    help = 'Populates the category field for existing halls'

    def handle(self, *args, **options):
        hall_categories = {
            'G Floor TAG Block (Cabin A)': 'CABIN',
            'I Floor TAG Block (Cabin B)': 'CABIN',
            'G Floor Work Bay (Cabin 1)': 'CABIN',
            'II Floor HR Block (Open Bay)': 'CABIN',
            'II Floor HR Block (Wellbeing Room)': 'ROOM',
            'I Floor TAG Block (Conference Room 2)': 'ROOM',
            'I Floor Work Bay (Conference Room 4)': 'ROOM',
            'I Floor Work Bay (Pine Wood)': 'ROOM',
            'III Floor HR Block (GYM Hall)': 'HALL',
            'I Floor HR Block (Multi-Purpose Hall)': 'HALL',
            'I Floor (Mezzanine Floor)': 'FLOOR',
            'I Floor (Work Bay 1)': 'FLOOR',
            'I Floor (Work Bay 2)': 'FLOOR',
            'III Floor HR Block (Terrace Garden)': 'OPEN',
            'G Floor (Cafeteria)': 'OPEN',
            'G Floor (Pathway)': 'OPEN',
            'Open Ground (Parking Zone)': 'OPEN',
            'CEO Cabin 1': 'CSUITE',
            'CEO Cabin 2': 'CSUITE',
            'CEO Cabin 3': 'CSUITE',
            'CEO Discussion Bay': 'CSUITE',
        }

        for hall_name, category in hall_categories.items():
            try:
                hall = HallMaster.objects.get(hall_name=hall_name)
                hall.category = category
                hall.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully updated category for "{hall_name}"'))
            except HallMaster.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Hall "{hall_name}" not found'))
