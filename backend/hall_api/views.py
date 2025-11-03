from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.utils import timezone
import pytz
from .models import *
from .serializers import *
from .utils import send_booking_confirmation_email, send_booking_rejection_email, get_next_available_slots
from .permissions import IsAdminOrSuperAdmin
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class EntityViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Entity
    """
    queryset = Entity.objects.filter(is_deleted=False)
    serializer_class = EntitySerializer
    permission_classes = [IsAdminOrSuperAdmin]

class OfficeMasterViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for OfficeMaster
    """
    queryset = OfficeMaster.objects.filter(is_deleted=False)
    serializer_class = OfficeMasterSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['office_city', 'office_state', 'office_country']
    search_fields = ['office_code', 'office_name', 'office_tag']
    ordering_fields = ['office_name', 'office_code']

    @action(detail=True, methods=['get'])
    def halls(self, request, pk=None):
        """Get all halls in a specific office"""
        office = self.get_object()
        halls = HallMaster.objects.filter(office=office, is_freeze=False)
        serializer = HallMasterSerializer(halls, many=True)
        return Response(serializer.data)

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()

class AdminUserViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for AdminUser
    """
    queryset = AdminUser.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['office', 'designation', 'shift']
    search_fields = ['admin_code', 'designation']

class HallMasterViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for HallMaster
    """
    queryset = HallMaster.objects.filter(is_deleted=False)
    serializer_class = HallMasterSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['office', 'capacity']
    search_fields = ['hall_code', 'hall_name']

    @action(detail=False, methods=['get'])
    def available(self, request):
        """
        Get available halls with filtering options
        Query parameters: office, min_capacity
        """
        office_id = request.query_params.get('office')
        min_capacity = request.query_params.get('min_capacity')
        
        queryset = self.get_queryset()
        
        if office_id:
            queryset = queryset.filter(office_id=office_id)
        if min_capacity:
            queryset = queryset.filter(capacity__gte=min_capacity)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def bookings(self, request, pk=None):
        """Get all bookings for a specific hall"""
        hall = self.get_object()
        bookings = Booking.objects.filter(hall=hall, is_deleted=False)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def booked_slots(self, request, pk=None):
        """Get all booked time slots for a specific hall and date with status information"""
        hall = self.get_object()
        date_str = request.query_params.get('date')

        if not date_str:
            return Response(
                {'error': 'Date parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        bookings = Booking.objects.filter(
            hall=hall,
            slot_date=date_str,
            is_deleted=False
        )
        
        # Return detailed information about each booking including status
        booked_slots_info = [
            {
                'slot_time': booking.slot_time,
                'status': booking.status
            }
            for booking in bookings
        ]
        return Response(booked_slots_info)

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()

class SessionMasterViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for SessionMaster
    """
    queryset = SessionMaster.objects.all()
    serializer_class = SessionMasterSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['session_code', 'session_type']

class InfrastructureViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Infrastructure
    """
    queryset = Infrastructure.objects.all()
    serializer_class = InfrastructureSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['infra_type']
    search_fields = ['infra_code', 'infra_item']

    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        """Update the stock count of an infrastructure item"""
        infra = self.get_object()
        change = request.data.get('change', 0)
        action_type = request.data.get('action', 'add')  # 'add' or 'subtract'
        
        if action_type == 'add':
            infra.nos_in_stock += int(change)
        elif action_type == 'subtract':
            if infra.nos_in_stock >= int(change):
                infra.nos_in_stock -= int(change)
            else:
                return Response(
                    {'error': 'Not enough stock available'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        infra.save()
        serializer = self.get_serializer(infra)
        return Response(serializer.data)

class SlotMasterViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for SlotMaster
    """
    queryset = SlotMaster.objects.all()
    serializer_class = SlotMasterSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['slot_date', 'slot_status']

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get available slots for a specific date"""
        date = request.query_params.get('date')
        if date:
            queryset = SlotMaster.objects.filter(slot_date=date, slot_status='Available')
        else:
            queryset = SlotMaster.objects.filter(slot_status='Available')
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update the status of a slot"""
        slot = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in ['Available', 'Booked']:
            slot.slot_status = new_status
            slot.save()
            serializer = self.get_serializer(slot)
            return Response(serializer.data)
        else:
            return Response(
                {'error': 'Status must be either "Available" or "Booked"'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class BookingViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Booking
    """
    queryset = Booking.objects.filter(is_deleted=False)
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]  # Default permission for all actions
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['office', 'hall', 'session', 'status', 'slot_date', 'approved']
    search_fields = ['emp_code', 'emp_name', 'team_name']
    ordering_fields = ['slot_date', 'book_date']
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['by_email', 'employee']:
            permission_classes = [AllowAny]
        elif self.action in ['approve', 'reject']:
            permission_classes = [IsAdminOrSuperAdmin]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """
        Get booking statistics (pending, approved, rejected).
        """
        pending_count = Booking.objects.filter(status='Pending', is_deleted=False).count()
        approved_count = Booking.objects.filter(status='Approved', is_deleted=False).count()
        rejected_count = Booking.objects.filter(status='Cancelled', is_deleted=False).count()

        return Response({
            'pending': pending_count,
            'approved': approved_count,
            'rejected': rejected_count,
        })

    def get_serializer_class(self):
        return BookingSerializer

    def perform_create(self, serializer):
        # Check for blocked dates
        slot_date = serializer.validated_data.get('slot_date')
        hall = serializer.validated_data.get('hall')
        
        if BlockedDate.objects.filter(hall=hall, blocked_date=slot_date).exists():
            raise serializers.ValidationError('This hall is blocked for the selected date.')

        # Auto-set book_date to current date
        booking = serializer.save()
        
        # Update slot status to booked
        slot = SlotMaster.objects.filter(
            slot_date=booking.slot_date,
            slot_time=booking.slot_time
        ).first()
        if slot:
            slot.slot_status = 'Booked'
            slot.save()

    def perform_destroy(self, instance):
        # Soft delete
        instance.is_deleted = True
        instance.save()
        
        # Update slot status to available
        slot = SlotMaster.objects.filter(
            slot_date=instance.slot_date,
            slot_time=instance.slot_time
        ).first()
        if slot:
            slot.slot_status = 'Available'
            slot.save()

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a booking and send a confirmation email."""
        booking = self.get_object()
        
        # Update booking status
        booking.status = 'Approved'
        booking.save()
        
        # Send confirmation email
        try:
            send_booking_confirmation_email(booking)
        except Exception as e:
            # Log the error, but don't block the response
            print(f"Error sending confirmation email for booking {booking.id}: {e}")
            
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a booking and send a rejection email with suggested slots."""
        booking = self.get_object()
        
        # Get reason and suggested slots from request data
        reason = request.data.get('reason', '')
        
        # Get next available slots
        next_available_slots = get_next_available_slots(booking.hall, count=5)
        
        # Update booking status
        booking.status = 'Rejected'
        booking.approved = False
        booking.save()
        
        # Update slot status to available
        slot = SlotMaster.objects.filter(
            slot_date=booking.slot_date,
            slot_time=booking.slot_time
        ).first()
        if slot:
            slot.slot_status = 'Available'
            slot.save()
        
        # Send rejection email with suggested slots
        try:
            send_booking_rejection_email(booking, reason, next_available_slots)
        except Exception as e:
            # Log the error, but don't block the response
            print(f"Error sending rejection email for booking {booking.id}: {e}")
            
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking."""
        booking = self.get_object()
        
        # Update booking status
        booking.status = 'Cancelled'
        booking.approved = False # A cancelled booking is not approved
        booking.save()
        
        # Update slot status to available
        slot = SlotMaster.objects.filter(
            slot_date=booking.slot_date,
            slot_time=booking.slot_time
        ).first()
        if slot:
            slot.slot_status = 'Available'
            slot.save()
            
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def employee(self, request):
        """Get bookings for a specific employee"""
        emp_code = request.query_params.get('emp_code')
        if emp_code:
            queryset = Booking.objects.filter(emp_code=emp_code, is_deleted=False)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response(
            {"error": "emp_code parameter is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming bookings"""
        queryset = Booking.objects.filter(
            slot_date__gte=timezone.now().date(),
            is_deleted=False
        ).order_by('slot_date', 'slot_time')
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def by_email(self, request):
        """Get bookings for a specific email"""
        emp_email = request.query_params.get('emp_email')
        if emp_email:
            queryset = Booking.objects.filter(emp_email_id=emp_email, is_deleted=False)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response(
            {"error": "emp_email parameter is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
class BlockedDateViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for BlockedDate
    """
    queryset = BlockedDate.objects.all()
    serializer_class = BlockedDateSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['office', 'hall', 'blocked_date']
    search_fields = ['reason']

    @action(detail=False, methods=['get'])
    def by_date(self, request):
        """Get blocked dates for a specific hall or all halls within a date range"""
        hall_id = request.query_params.get('hall')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date:
            return Response(
                {'error': 'start_date parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = self.get_queryset()
        
        # Filter by hall if specified and not 'all'
        if hall_id and hall_id != 'all':
            queryset = queryset.filter(hall_id=hall_id)
        # If hall_id is 'all', we don't filter by hall, so we get all blocked dates
        # This means we'll get blocked dates for all halls
        
        # Filter by date range
        if start_date:
            queryset = queryset.filter(blocked_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(blocked_date__lte=end_date)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import EmailOTP
from .serializers import EmailOTPSerializer, VerifyOTPSerializer
from .utils import is_allowed_domain, generate_otp, send_otp_via_email


@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    """
    Send OTP to the provided email if domain is allowed
    """
    serializer = EmailOTPSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        # Check if domain is allowed
        if not is_allowed_domain(email):
            return Response(
                {'error': 'Email domain not allowed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate OTP
        otp = generate_otp()
        
        # Delete any existing OTPs for this email
        EmailOTP.objects.filter(email=email).delete()
        
        # Save new OTP to database
        EmailOTP.objects.create(email=email, otp=otp)
        
        # Send OTP via email
        try:
            send_otp_via_email(email, otp)
            return Response(
                {'message': 'OTP sent successfully'}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to send OTP: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """
    Verify the provided OTP
    """
    serializer = VerifyOTPSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        
        try:
            email_otp = EmailOTP.objects.get(email=email, otp=otp)
        except EmailOTP.DoesNotExist:
            return Response(
                {'error': 'Invalid OTP'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if OTP is expired
        if email_otp.is_expired():
            email_otp.delete()  # Delete expired OTP
            return Response(
                {'error': 'OTP expired'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Delete OTP after successful verification
        email_otp.delete()
        
        return Response(
            {'message': 'OTP verified successfully'}, 
            status=status.HTTP_200_OK
        )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# from rest_framework.permissions import IsAdminUser

@api_view(['GET'])
@permission_classes([IsAdminOrSuperAdmin])
def dashboard_stats(request):
    """
    Get statistics for the admin dashboard, optionally filtered by office, date, category, and session.
    """
    office_id = request.query_params.get('office_id')
    slot_date = request.query_params.get('slot_date')
    category = request.query_params.get('category')
    session_id = request.query_params.get('session_id')

    # Base querysets
    halls_queryset = HallMaster.objects
    bookings_queryset = Booking.objects

    if office_id:
        halls_queryset = halls_queryset.filter(office_id=office_id)
        bookings_queryset = bookings_queryset.filter(office_id=office_id)

    if slot_date:
        bookings_queryset = bookings_queryset.filter(slot_date=slot_date)

    if category:
        halls_queryset = halls_queryset.filter(category=category)
        # We also need to filter bookings based on the halls of the selected category
        bookings_queryset = bookings_queryset.filter(hall__category=category)
    
    if session_id:
        bookings_queryset = bookings_queryset.filter(session_id=session_id)


    total_halls = halls_queryset.count()
    available_halls = halls_queryset.filter(is_freeze=False).count()
    working_halls = halls_queryset.filter(is_freeze=True).count()
    
    upcoming_booked_halls = bookings_queryset.filter(
        status='Approved',
        slot_date__gte=timezone.now().date()
    ).count()

    # Add booking status counts
    pending_bookings = bookings_queryset.filter(status='Pending').count()
    approved_bookings = bookings_queryset.filter(status='Approved').count()
    rejected_bookings = bookings_queryset.filter(status='Rejected').count()
    cancelled_bookings = bookings_queryset.filter(status='Cancelled').count()

    upcoming_bookings = bookings_queryset.filter(
        status='Approved',
        slot_date__gte=timezone.now().date()
    ).order_by('slot_date', 'slot_time')[:5]

    upcoming_bookings_serializer = BookingSerializer(upcoming_bookings, many=True)

    return Response({
        'total_halls': total_halls,
        'available_halls': available_halls,
        'working_halls': working_halls,
        'upcoming_booked_halls': upcoming_booked_halls,
        'upcoming_bookings': upcoming_bookings_serializer.data,
        'pending_bookings': pending_bookings,
        'approved_bookings': approved_bookings,
        'rejected_bookings': rejected_bookings,
        'cancelled_bookings': cancelled_bookings,
    })

@api_view(['GET'])
@permission_classes([IsAdminOrSuperAdmin])
def current_working_halls(request):
    """
    Get halls that are currently in use (booked for the current time slot with approved status).
    """
    from datetime import datetime, time
    from django.utils import timezone
    
    # Get current time in Asia/Calcutta timezone
    tz = pytz.timezone('Asia/Calcutta')
    current_datetime = timezone.now().astimezone(tz)
    current_time = current_datetime.time()
    current_date = current_datetime.date()
    
    # Determine the current time slot based on current time
    # Time slots are in 30-minute intervals
    hour = current_time.hour
    minute = current_time.minute
    
    # Round down to the nearest 30-minute slot
    if minute < 30:
        slot_start_minute = 0
    else:
        slot_start_minute = 30
    
    slot_start_time = time(hour, slot_start_minute)
    slot_end_time = time(hour, slot_start_minute + 30) if slot_start_minute == 0 else time(hour + 1, 0)
    
    # Format the slot time to match the format in the database (e.g., "3:0 PM - 3:30 PM")
    # Convert to 12-hour format with AM/PM
    start_hour = slot_start_time.hour
    start_minute = slot_start_time.minute
    end_hour = slot_end_time.hour
    end_minute = slot_end_time.minute
    
    # Convert to 12-hour format
    start_period = "AM" if start_hour < 12 else "PM"
    end_period = "AM" if end_hour < 12 else "PM"
    
    # Convert hour to 12-hour format
    start_12hour = start_hour if start_hour <= 12 else start_hour - 12
    start_12hour = 12 if start_12hour == 0 else start_12hour
    end_12hour = end_hour if end_hour <= 12 else end_hour - 12
    end_12hour = 12 if end_12hour == 0 else end_12hour
    
    current_slot_time = f"{start_12hour}:{start_minute:02d} {start_period} - {end_12hour}:{end_minute:02d} {end_period}"
    
    # Find bookings for the current time slot
    current_bookings = Booking.objects.filter(
        status='Approved',
        slot_date=current_date,
        slot_time=current_slot_time
    ).select_related('hall').order_by('hall__hall_name')
    
    # Create a list of current working halls with team names
    working_halls = []
    for booking in current_bookings:
        working_halls.append({
            'hall_id': booking.hall.id,
            'hall_name': booking.hall.hall_name,
            'team_name': booking.team_name,
            'slot_time': booking.slot_time,
            'emp_name': booking.emp_name
        })
    
    return Response(working_halls)

@api_view(['GET'])
@permission_classes([IsAdminOrSuperAdmin])
def pending_approvals(request):
    """
    Get bookings that are pending approval.
    """
    pending_bookings = Booking.objects.filter(
        status='Pending'
    ).select_related('hall', 'office').order_by('slot_date', 'slot_time')
    
    serializer = BookingSerializer(pending_bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def hall_categories(request):
    """
    Get all hall categories.
    """
    categories = HallMaster.Categories.choices
    return Response([category[0] for category in categories])