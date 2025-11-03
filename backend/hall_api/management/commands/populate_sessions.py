from django.core.management.base import BaseCommand
from hall_api.models import SessionMaster, HallMaster

class Command(BaseCommand):
    help = 'Populates SessionMaster data with predefined values'

    def handle(self, *args, **options):
        # Mapping of hall names from the user's table to actual hall codes
        hall_name_to_code = {
            'Cabin A': 'VDGCC001',
            'Cabin B': 'VDGCC002',
            'Pine Wood': 'VDGCC005',
            'Conference Hall 2': 'VDGCC003',
            'Conference Hall 4': 'VDGCC006',
            'Multi Purpose Hall': 'VDGCC007',
            'GYM Room': 'VDGCC010',
            'Wellbeing Room': 'VDGCC009',
            'I Floor (Work Bay 1)': 'VDGCC011',
            'I Floor (Work Bay 2)': 'VDGCC012',
            'I Floor (Mezzaine)': 'VDGCC013',
            'Cafeteria': 'VDGCC019',
            'Terrace': 'VDGCC020',
            'Pathway': 'VDGCC018',
            'Open Ground': 'VDGCC021'
        }

        # Session data from the user's table
        sessions_data = [
            {
                'session_code': 'S001',
                'session_type': 'One To One Discussion',
                'preferred_hall_1': 'Cabin A',
                'preferred_hall_2': 'Cabin B',
                'preferred_hall_3': None
            },
            {
                'session_code': 'S002',
                'session_type': 'Interview',
                'preferred_hall_1': 'Cabin A',
                'preferred_hall_2': 'Cabin B',
                'preferred_hall_3': 'Pine Wood'
            },
            {
                'session_code': 'S003',
                'session_type': 'Group Discussion',
                'preferred_hall_1': 'Conference Hall 2',
                'preferred_hall_2': 'Conference Hall 4',
                'preferred_hall_3': 'Pine Wood'
            },
            {
                'session_code': 'S004',
                'session_type': 'Client Visit',
                'preferred_hall_1': 'Conference Hall 2',
                'preferred_hall_2': 'Conference Hall 4',
                'preferred_hall_3': None
            },
            {
                'session_code': 'S005',
                'session_type': 'Training / Workshop',
                'preferred_hall_1': 'Multi Purpose Hall',
                'preferred_hall_2': 'GYM Room',
                'preferred_hall_3': None
            },
            {
                'session_code': 'S006',
                'session_type': 'Special Camps',
                'preferred_hall_1': 'Multi Purpose Hall',
                'preferred_hall_2': 'GYM Room',
                'preferred_hall_3': None
            },
            {
                'session_code': 'S007',
                'session_type': 'Hospitality',
                'preferred_hall_1': 'Wellbeing Room',
                'preferred_hall_2': None,
                'preferred_hall_3': None
            },
            {
                'session_code': 'S008',
                'session_type': 'Industy Visit',
                'preferred_hall_1': 'I Floor (Work Bay 1)',
                'preferred_hall_2': 'I Floor (Work Bay 2)',
                'preferred_hall_3': 'I Floor (Mezzaine)'
            },
            {
                'session_code': 'S009',
                'session_type': 'Birthday / Anniversary  Celebration',
                'preferred_hall_1': 'Cafeteria',
                'preferred_hall_2': 'Terrace',
                'preferred_hall_3': None
            },
            {
                'session_code': 'S010',
                'session_type': 'Team Lunch / Dinner',
                'preferred_hall_1': 'Cafeteria',
                'preferred_hall_2': 'Terrace',
                'preferred_hall_3': None
            },
            {
                'session_code': 'S011',
                'session_type': 'Lunch & Learn',
                'preferred_hall_1': 'Cafeteria',
                'preferred_hall_2': None,
                'preferred_hall_3': None
            },
            {
                'session_code': 'S012',
                'session_type': 'Fun Friday',
                'preferred_hall_1': 'Pathway',
                'preferred_hall_2': None,
                'preferred_hall_3': None
            },
            {
                'session_code': 'S013',
                'session_type': 'Festival Celebrations',
                'preferred_hall_1': 'Open Ground',
                'preferred_hall_2': None,
                'preferred_hall_3': None
            },
            {
                'session_code': 'S014',
                'session_type': 'Others',
                'preferred_hall_1': None,
                'preferred_hall_2': None,
                'preferred_hall_3': None
            }
        ]

        # Populate SessionMaster data
        for data in sessions_data:
            # Get hall objects for preferred halls if they exist
            preferred_hall_1 = None
            preferred_hall_2 = None
            preferred_hall_3 = None
            
            if data['preferred_hall_1'] and data['preferred_hall_1'] in hall_name_to_code:
                try:
                    preferred_hall_1 = HallMaster.objects.get(hall_code=hall_name_to_code[data['preferred_hall_1']])
                except HallMaster.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"HallMaster with code {hall_name_to_code[data['preferred_hall_1']]} not found for preferred_hall_1"))
            
            if data['preferred_hall_2'] and data['preferred_hall_2'] in hall_name_to_code:
                try:
                    preferred_hall_2 = HallMaster.objects.get(hall_code=hall_name_to_code[data['preferred_hall_2']])
                except HallMaster.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"HallMaster with code {hall_name_to_code[data['preferred_hall_2']]} not found for preferred_hall_2"))
            
            if data['preferred_hall_3'] and data['preferred_hall_3'] in hall_name_to_code:
                try:
                    preferred_hall_3 = HallMaster.objects.get(hall_code=hall_name_to_code[data['preferred_hall_3']])
                except HallMaster.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"HallMaster with code {hall_name_to_code[data['preferred_hall_3']]} not found for preferred_hall_3"))

            # Create or update session
            session, created = SessionMaster.objects.get_or_create(
                session_code=data['session_code'],
                defaults={
                    'session_type': data['session_type'],
                    'preferred_hall_1': preferred_hall_1,
                    'preferred_hall_2': preferred_hall_2,
                    'preferred_hall_3': preferred_hall_3,
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"Successfully created SessionMaster: {session.session_code} - {session.session_type}"))
            else:
                # Update existing session
                session.session_type = data['session_type']
                session.preferred_hall_1 = preferred_hall_1
                session.preferred_hall_2 = preferred_hall_2
                session.preferred_hall_3 = preferred_hall_3
                session.save()
                self.stdout.write(self.style.WARNING(f"SessionMaster already exists, updated: {session.session_code} - {session.session_type}"))

        self.stdout.write(self.style.SUCCESS('SessionMaster data population complete.'))