from django.core.management.base import BaseCommand
from hall_api.models import AdminUser, OfficeMaster

class Command(BaseCommand):
    help = 'Creates sample admin users'

    def handle(self, *args, **kwargs):
        # Create a sample office if it doesn't exist
        office, created = OfficeMaster.objects.get_or_create(
            office_code='OFF001',
            defaults={
                'office_name': 'Main Office',
                'office_tag': 'HQ',
                'office_street': '123 Main St',
                'office_area': 'Downtown',
                'office_city': 'Anytown',
                'office_state': 'Anystate',
                'office_country': 'Anycountry',
                'office_pin_code': '12345'
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS('Successfully created office "OFF001"'))

        # Create a superadmin user
        if not AdminUser.objects.filter(admin_code='superadmin').exists():
            superadmin = AdminUser.objects.create_user(
                username='superadmin',
                admin_code='superadmin',
                password='password123',
                role=AdminUser.Roles.SUPERADMIN,
                office=office,
                designation='Head Honcho',
                shift='Day',
                mobile_no='1234567890',
                is_staff=True,
                is_superuser=True
            )
            self.stdout.write(self.style.SUCCESS('Successfully created superadmin user'))
        else:
            self.stdout.write(self.style.WARNING('Superadmin user already exists'))

        # Create a regular admin user
        if not AdminUser.objects.filter(admin_code='admin').exists():
            admin = AdminUser.objects.create_user(
                username='admin',
                admin_code='admin',
                password='password123',
                role=AdminUser.Roles.ADMIN,
                office=office,
                designation='Administrator',
                shift='Day',
                mobile_no='0987654321',
                is_staff=True,
                is_superuser=False
            )
            self.stdout.write(self.style.SUCCESS('Successfully created admin user'))
        else:
            self.stdout.write(self.style.WARNING('Admin user already exists'))