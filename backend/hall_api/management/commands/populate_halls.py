from django.core.management.base import BaseCommand
from hall_api.models import OfficeMaster, HallMaster, AdminUser

class Command(BaseCommand):
    help = 'Populates HallMaster data with predefined values'

    def handle(self, *args, **options):
        # Data provided in the prompt
        halls_data = [
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC001', 'Hall Name': 'G Floor TAG Block (Cabin A)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 3},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC002', 'Hall Name': 'I Floor TAG Block (Cabin B)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 6},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC003', 'Hall Name': 'I Floor TAG Block (Conference Room 2)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 13},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC004', 'Hall Name': 'G Floor Work Bay (Cabin 1)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 3},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC005', 'Hall Name': 'I Floor  Work Bay (Pine Wood)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 20},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC006', 'Hall Name': 'I Floor Work Bay (Conference Room 4)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 13},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC007', 'Hall Name': 'I Floor HR Block (Multi Purpose Hall)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 60},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC008', 'Hall Name': 'II Floor HR Block (Open Bay)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 4},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC009', 'Hall Name': 'II Floor HR Block (Wellbeing Room)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 2},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC010', 'Hall Name': 'III Floor HR Block (GYM Room)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 30},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC011', 'Hall Name': 'I Floor (Work Bay 1)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 60},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC012', 'Hall Name': 'I Floor (Work Bay 2)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 60},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC013', 'Hall Name': 'I Floor (Mezzaine Floor)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 30},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC014', 'Hall Name': 'CEO Cabin 1', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 3},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC015', 'Hall Name': 'CEO Cabin 2', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 3},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC016', 'Hall Name': 'CEO Cabin 3', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 3},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC017', 'Hall Name': 'CEO Dicussion Bay', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 13},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC018', 'Hall Name': 'G Floor (Pathway)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 150},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC019', 'Hall Name': 'G Floor (Cafeteria)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 60},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC020', 'Hall Name': 'III Floor HR Block (Terrace Garden)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 30},
            {'Office Code': 'GCCTRY', 'Hall Code': 'VDGCC021', 'Hall Name': 'Open Ground (Parking Zone)', 'Day SPOC': 'ADM002', 'Mid SPOC': 'ADM005', 'Night SPOC': 'ADM009', 'Capacity': 300},
        ]

        try:
            office = OfficeMaster.objects.get(office_code='GCCTRY')
        except OfficeMaster.DoesNotExist:
            self.stdout.write(self.style.ERROR("OfficeMaster with office_code 'GCCTRY' not found. Please create it first."))
            return
        # Removed AdminUser fetching as they are not mandatory

        for data in halls_data:
            hall, created = HallMaster.objects.get_or_create(
                hall_code=data['Hall Code'],
                defaults={
                    'office': office,
                    'hall_name': data['Hall Name'],
                    'capacity': data['Capacity'],
                    'about': "This hall is ideal for conferences, workshops, and events. Fully equipped with modern amenities to make your sessions productive and seamless.",
                    'day_spoc': None,
                    'mid_spoc': None,
                    'night_spoc': None,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Successfully created HallMaster: {hall.hall_name}"))
            else:
                # If hall already exists, update its 'about' field
                hall.about = "This hall is ideal for conferences, workshops, and events. Fully equipped with modern amenities to make your sessions productive and seamless."
                hall.save()
                self.stdout.write(self.style.WARNING(f"HallMaster already exists, updated 'about' field: {hall.hall_name}"))

        self.stdout.write(self.style.SUCCESS('HallMaster data population complete.'))