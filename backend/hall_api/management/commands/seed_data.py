import datetime
from django.core.management.base import BaseCommand
from hall_api.models import (
    Entity, OfficeMaster, AdminUser, HallMaster, 
    SessionMaster, Infrastructure, SlotMaster, Booking
)

class Command(BaseCommand):
    help = 'Seeds the database with sample data for all models.'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Clear existing data to avoid duplicates
     
        # Create Entities
        entities = []
        for i in range(1, 4):
            entity, created = Entity.objects.get_or_create(
                entity_code=f'ENT00{i}',
                defaults={'entity_name': f'Entity {i}', 'location': f'Location {i}'}
            )
            entities.append(entity)
        self.stdout.write(self.style.SUCCESS('Successfully seeded Entities.'))

        # Create OfficeMasters
        offices = []
        for i in range(1, 4):
            office, created = OfficeMaster.objects.get_or_create(
                office_code=f'OFF00{i}',
                defaults={
                    'office_name': f'Office {i}',
                    'office_tag': f'Tag{i}',
                    'office_street': f'{i} Street',
                    'office_area': f'Area {i}',
                    'office_city': f'City {i}',
                    'office_state': f'State {i}',
                    'office_country': 'Country',
                    'office_pin_code': f'1111{i}{i}'
                }
            )
            office.entities.add(entities[i-1])
            offices.append(office)
        self.stdout.write(self.style.SUCCESS('Successfully seeded OfficeMasters.'))

        # Create AdminUsers
        admin_users = []
        for i in range(1, 4):
            username = f'admin{i}'
            if not AdminUser.objects.filter(username=username).exists():
                user = AdminUser.objects.create_user(
                    username=username,
                    admin_code=f'ADM00{i}',
                    password='password123',
                    role=AdminUser.Roles.ADMIN,
                    office=offices[i-1],
                    designation=f'Designation {i}',
                    shift='Day',
                    mobile_no=f'123456789{i}',
                    is_staff=True
                )
                admin_users.append(user)
        self.stdout.write(self.style.SUCCESS('Successfully seeded AdminUsers.'))
        
        # Create HallMasters
        halls = []
        for i in range(1, 4):
            hall, created = HallMaster.objects.get_or_create(
                hall_code=f'HALL00{i}',
                defaults={
                    'office': offices[i-1],
                    'hall_name': f'Hall {i}',
                    'capacity': 100 * i,
                }
            )
            halls.append(hall)
        self.stdout.write(self.style.SUCCESS('Successfully seeded HallMasters.'))

        # Create SessionMasters
        sessions = []
        for i in range(1, 4):
            session, created = SessionMaster.objects.get_or_create(
                session_code=f'SESS00{i}',
                defaults={
                    'hall': halls[i-1],
                    'session_type': f'Session Type {i}'
                }
            )
            sessions.append(session)
        self.stdout.write(self.style.SUCCESS('Successfully seeded SessionMasters.'))

        # Create Infrastructures
        infras = []
        for i in range(1, 4):
            infra, created = Infrastructure.objects.get_or_create(
                infra_code=f'INFRA00{i}',
                defaults={
                    'hall': halls[i-1],
                    'infra_type': f'Infra Type {i}',
                    'infra_item': f'Infra Item {i}',
                    'nos_in_stock': 10 * i
                }
            )
            infras.append(infra)
        self.stdout.write(self.style.SUCCESS('Successfully seeded Infrastructures.'))

        # Create SlotMasters
        slots = []
        today = datetime.date.today()
        for i in range(1, 4):
            slot_date = today + datetime.timedelta(days=i)
            slot, created = SlotMaster.objects.get_or_create(
                slot_date=slot_date,
                slot_time=f'09:00-10:00',
                hall=halls[i-1],
                defaults={'slot_status': 'Available'}
            )
            slots.append(slot)
        self.stdout.write(self.style.SUCCESS('Successfully seeded SlotMasters.'))

        # Create Bookings
        for i in range(1, 4):
            Booking.objects.get_or_create(
                slot_date=slots[i-1].slot_date,
                slot_time=slots[i-1].slot_time,
                office=offices[i-1],
                hall=halls[i-1],
                session=sessions[i-1],
                emp_code=f'EMP00{i}',
                defaults={
                    'emp_name': f'Employee {i}',
                    'emp_email_id': f'emp{i}@example.com',
                    'emp_mobile_no': f'987654321{i}',
                    'team_name': f'Team {i}',
                    'status': 'Pending'
                }
            )
        self.stdout.write(self.style.SUCCESS('Successfully seeded Bookings.'))

        self.stdout.write(self.style.SUCCESS('Database seeding complete.'))