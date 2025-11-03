import random
import string
from django.core.mail import send_mail
from django.conf import settings
from .models import SlotMaster

# List of allowed domains - can be extended as needed
ALLOWED_DOMAINS = ['vdartinc.com','vdartacademy.com','vdartdigital.com','siddahamed.com']

def is_allowed_domain(email):
    """
    Check if the email domain is in the allowed domains list
    """
    domain = email.split('@')[-1].lower()
    return domain in ALLOWED_DOMAINS

def generate_otp():
    """
    Generate a random 6-digit OTP
    """
    return ''.join(random.choices(string.digits, k=6))

def send_otp_via_email(email, otp):
    """
    Send OTP via email using Django's email backend
    """
    subject = 'Your OTP for Hall Booking System'
    message = f'Your OTP is: {otp}. This OTP will expire in 5 minutes.'
    from_email = settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@hallbooking.com'
    
    send_mail(
        subject,
        message,
        from_email,
        [email],
        fail_silently=False,
    )
def send_booking_confirmation_email(booking):
    """
    Send booking confirmation email to the user.
    """
    subject = f'Booking Confirmed: {booking.hall.hall_name} on {booking.slot_date}'
    
    message = f"""
    Dear {booking.emp_name},

    Your booking for {booking.hall.hall_name} on {booking.slot_date} at {booking.slot_time} has been confirmed.

  

    Thank you for using the Hall Booking System.
    """
    from_email = settings.DEFAULT_FROM_EMAIL
    
    send_mail(
        subject,
        message,
        from_email,
        [booking.emp_email_id],
        fail_silently=False,
    )

def send_booking_rejection_email(booking, reason="", next_available_slots=None):
    """
    Send booking rejection email to the user with reason and suggested slots.
    """
    subject = f'Booking Rejected: {booking.hall.hall_name} on {booking.slot_date}'
    
    # Create slots text
    slots_text = ""
    if next_available_slots:
        slots_text = "\n\nSuggested Next Available Slots:\n"
        for slot in next_available_slots[:5]:  # Limit to 5 slots
            slots_text += f"- {slot['date']} at {slot['time']}\n"
    
    message = f"""
    Dear {booking.emp_name},

    We regret to inform you that your booking for {booking.hall.hall_name} on {booking.slot_date} at {booking.slot_time} has been rejected.

    Reason: {reason if reason else 'No specific reason provided.'}
    {slots_text}

    Please consider booking one of the suggested slots or contact the hall administrator for further assistance.

    Thank you for using the Hall Booking System.
    """
    from_email = settings.DEFAULT_FROM_EMAIL
    
    send_mail(
        subject,
        message,
        from_email,
        [booking.emp_email_id],
        fail_silently=False,
    )

def get_next_available_slots(hall, count=5):
    """
    Get the next 'count' available slots for a hall.
    """
    from django.utils import timezone
    from datetime import timedelta
    import calendar
    
    available_slots = []
    current_date = timezone.now().date()
    
    # Try to find available slots for the next 30 days
    for i in range(30):
        check_date = current_date + timedelta(days=i)
        
        # Skip Sundays (assuming 6 = Sunday in Python's weekday numbering)
        if check_date.weekday() == 6:
            continue
            
        # Check for available slots on this date
        slots = SlotMaster.objects.filter(
            hall=hall,
            slot_date=check_date,
            slot_status='Available'
        ).order_by('slot_time')
        
        for slot in slots:
            available_slots.append({
                'date': slot.slot_date.strftime('%Y-%m-%d'),
                'time': slot.slot_time
            })
            
            # Stop if we have enough slots
            if len(available_slots) >= count:
                break
                
        # Stop if we have enough slots
        if len(available_slots) >= count:
            break
            
    return available_slots