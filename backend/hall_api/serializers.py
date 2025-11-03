from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        return token

class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity
        fields = '__all__'

class AdminUserSerializer(serializers.ModelSerializer):
    office_name = serializers.CharField(source='office.office_name', read_only=True)
    
    class Meta:
        model = AdminUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class OfficeMasterSerializer(serializers.ModelSerializer):
    office_spoc_details = AdminUserSerializer(source='office_spoc', read_only=True)
    
    class Meta:
        model = OfficeMaster
        fields = '__all__'

class HallMasterSerializer(serializers.ModelSerializer):
    office_name = serializers.CharField(source='office.office_name', read_only=True)
    day_spoc_details = AdminUserSerializer(source='day_spoc', read_only=True)
    mid_spoc_details = AdminUserSerializer(source='mid_spoc', read_only=True)
    night_spoc_details = AdminUserSerializer(source='night_spoc', read_only=True)
    
    class Meta:
        model = HallMaster
        fields = [
            'id', 'office', 'office_name', 'hall_code', 'hall_name', 'about',
            'image', 'day_spoc', 'mid_spoc', 'night_spoc', 'capacity',
            'is_freeze', 'wifi', 'tv', 'whiteboard', 'speaker', 'mic',
            'extension_power_box', 'stationaries', 'chairs_tables',
            'day_spoc_details', 'mid_spoc_details', 'night_spoc_details',
            'category'
        ]
        extra_kwargs = {
            'image': {'required': False}
        }

class SessionMasterSerializer(serializers.ModelSerializer):
    preferred_hall_1_details = HallMasterSerializer(source='preferred_hall_1', read_only=True)
    preferred_hall_2_details = HallMasterSerializer(source='preferred_hall_2', read_only=True)
    preferred_hall_3_details = HallMasterSerializer(source='preferred_hall_3', read_only=True)
    
    class Meta:
        model = SessionMaster
        fields = '__all__'

class InfrastructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infrastructure
        fields = '__all__'

class SlotMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlotMaster
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    office_name = serializers.CharField(source='office.office_name', read_only=True)
    hall_name = serializers.CharField(source='hall.hall_name', read_only=True)
    session_type = serializers.CharField(source='session.session_type', read_only=True)
    hall_category = serializers.CharField(source='hall.category', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('book_date',)

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('book_date', 'status', 'approved')
class EmailOTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailOTP
        fields = ['email']


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
class BlockedDateSerializer(serializers.ModelSerializer):
    office_name = serializers.CharField(source='office.office_name', read_only=True)
    hall_name = serializers.CharField(source='hall.hall_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = BlockedDate
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')