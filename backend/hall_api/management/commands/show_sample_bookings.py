from django.core.management.base import BaseCommand
from hall_api.models import Booking

class Command(BaseCommand):
    help = 'Show sample bookings to check slot_time format'

    def handle(self, *args, **options):
        # Get a few sample bookings
        bookings = Booking.objects.all()[:10]
        
        self.stdout.write("Sample bookings:")
        for booking in bookings:
            self.stdout.write(f"ID: {booking.id}, Date: {booking.slot_date}, Time: {booking.slot_time}, Hall: {booking.hall.hall_name}, Status: {booking.status}")