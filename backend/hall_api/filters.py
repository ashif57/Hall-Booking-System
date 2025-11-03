import django_filters
from django_filters import rest_framework as filters
from .models import *

class OfficeMasterFilter(django_filters.FilterSet):
    office_city = django_filters.CharFilter(lookup_expr='icontains')
    office_state = django_filters.CharFilter(lookup_expr='icontains')
    office_country = django_filters.CharFilter(lookup_expr='icontains')
    has_spoc = django_filters.BooleanFilter(field_name='office_spoc', lookup_expr='isnull', exclude=True)

    class Meta:
        model = OfficeMaster
        fields = {
            'office_code': ['exact', 'icontains'],
            'office_name': ['exact', 'icontains'],
            'office_tag': ['exact', 'icontains'],
            'office_pin_code': ['exact', 'icontains'],
        }

class AdminUserFilter(django_filters.FilterSet):
    office_name = django_filters.CharFilter(field_name='office__office_name', lookup_expr='icontains')
    office_code = django_filters.CharFilter(field_name='office__office_code', lookup_expr='exact')
    
    class Meta:
        model = AdminUser
        fields = {
            'admin_code': ['exact', 'icontains'],
            'designation': ['exact', 'icontains'],
            'shift': ['exact'],
            'mobile_no': ['exact', 'icontains'],
        }

class HallMasterFilter(django_filters.FilterSet):
    min_capacity = django_filters.NumberFilter(field_name='capacity', lookup_expr='gte')
    max_capacity = django_filters.NumberFilter(field_name='capacity', lookup_expr='lte')
    office_name = django_filters.CharFilter(field_name='office__office_name', lookup_expr='icontains')
    office_code = django_filters.CharFilter(field_name='office__office_code', lookup_expr='exact')
    
    # Boolean filters for amenities
    has_table = django_filters.BooleanFilter(field_name='table')
    has_chairs = django_filters.BooleanFilter(field_name='chairs')
    has_white_board = django_filters.BooleanFilter(field_name='white_board')
    has_video = django_filters.BooleanFilter(field_name='video')
    has_audio = django_filters.BooleanFilter(field_name='audio')
    has_wifi = django_filters.BooleanFilter(field_name='wifi')

    class Meta:
        model = HallMaster
        fields = {
            'hall_code': ['exact', 'icontains'],
            'hall_name': ['exact', 'icontains'],
            'capacity': ['exact', 'gte', 'lte'],
        }

class SessionMasterFilter(django_filters.FilterSet):
    preferred_hall = django_filters.CharFilter(
        field_name='preferred_hall_1__hall_code', 
        lookup_expr='icontains'
    )
    
    class Meta:
        model = SessionMaster
        fields = {
            'session_code': ['exact', 'icontains'],
            'session_type': ['exact', 'icontains'],
        }

class InfrastructureFilter(django_filters.FilterSet):
    min_stock = django_filters.NumberFilter(field_name='nos_in_stock', lookup_expr='gte')
    max_stock = django_filters.NumberFilter(field_name='nos_in_stock', lookup_expr='lte')
    
    class Meta:
        model = Infrastructure
        fields = {
            'infra_code': ['exact', 'icontains'],
            'infra_type': ['exact', 'icontains'],
            'infra_item': ['exact', 'icontains'],
            'nos_in_stock': ['exact', 'gte', 'lte'],
        }

class SlotMasterFilter(django_filters.FilterSet):
    date_range = django_filters.DateFromToRangeFilter(field_name='slot_date')
    time_contains = django_filters.CharFilter(field_name='slot_time', lookup_expr='icontains')
    
    class Meta:
        model = SlotMaster
        fields = {
            'slot_date': ['exact', 'gte', 'lte'],
            'slot_time': ['exact', 'icontains'],
            'slot_status': ['exact'],
        }

class BookingFilter(django_filters.FilterSet):
    date_range = django_filters.DateFromToRangeFilter(field_name='slot_date')
    office_name = django_filters.CharFilter(field_name='office__office_name', lookup_expr='icontains')
    hall_name = django_filters.CharFilter(field_name='hall__hall_name', lookup_expr='icontains')
    session_type = django_filters.CharFilter(field_name='session__session_type', lookup_expr='icontains')
    upcoming = django_filters.BooleanFilter(method='filter_upcoming')
    
    class Meta:
        model = Booking
        fields = {
            'emp_code': ['exact', 'icontains'],
            'emp_name': ['exact', 'icontains'],
            'team_name': ['exact', 'icontains'],
            'status': ['exact'],
            'approved': ['exact'],
            'slot_date': ['exact', 'gte', 'lte'],
        }
    
    def filter_upcoming(self, queryset, name, value):
        from django.utils import timezone
        if value:
            return queryset.filter(slot_date__gte=timezone.now().date())
        return queryset