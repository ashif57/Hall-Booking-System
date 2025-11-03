from django.db import models
from django.contrib.auth.models import AbstractUser

class Entity(models.Model):
    entity_code = models.CharField(max_length=50, unique=True)
    entity_name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.entity_code} - {self.entity_name}"
    
class OfficeMaster(models.Model):
    entities = models.ManyToManyField(Entity)
    office_code = models.CharField(max_length=50, unique=True)
    office_name = models.CharField(max_length=200)
    office_tag = models.CharField(max_length=100)
    office_street = models.CharField(max_length=200)
    office_area = models.CharField(max_length=100)
    office_city = models.CharField(max_length=100)
    office_state = models.CharField(max_length=100)
    office_country = models.CharField(max_length=100)
    office_pin_code = models.CharField(max_length=20)
    office_spoc = models.ForeignKey('AdminUser', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.office_code} - {self.office_name}"

class AdminUser(AbstractUser):
    class Roles(models.TextChoices):
        SUPERADMIN = "SUPERADMIN", "Super Admin"
        ADMIN = "ADMIN", "Admin"
        HR = "HR", "Human Resources"
        CAFFETERIA = "CAFETERIA", "Cafeteria"
        IT_SUPPORT = "IT_SUPPORT", "IT Support"
    admin_code = models.CharField(max_length=50, primary_key=True)
    role = models.CharField(max_length=50, choices=Roles.choices, default=Roles.ADMIN, blank=True, null=True)
    office = models.ForeignKey(OfficeMaster, on_delete=models.CASCADE , blank=True, null=True)
    designation = models.CharField(max_length=100)
    shift = models.CharField(max_length=50)
    mobile_no = models.CharField(max_length=15)
    others = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    def __str__(self):
        return self.admin_code

class HallMaster(models.Model):
    class Categories(models.TextChoices):
        CABIN = "CABIN", "Cabin"
        ROOM = "ROOM", "Room"
        HALL = "HALL", "Hall"
        FLOOR = "FLOOR", "Floor"
        OPEN = "OPEN", "Open"
        CSUITE = "CSUITE", "CSuite"
    
    category = models.CharField(max_length=50, choices=Categories.choices, default=Categories.HALL)
    office = models.ForeignKey(OfficeMaster, on_delete=models.CASCADE,null=True, blank=True)
    hall_code = models.CharField(max_length=50, unique=True)
    hall_name = models.CharField(max_length=200)
    about = models.TextField( blank=True, null=True)
    image = models.ImageField(upload_to='hall_images/', blank=True, null=True)
    day_spoc = models.ForeignKey(AdminUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='day_spoc_halls')
    mid_spoc = models.ForeignKey(AdminUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='mid_spoc_halls')
    night_spoc = models.ForeignKey(AdminUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='night_spoc_halls')
    capacity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False) 
    is_freeze = models.BooleanField(default=False)
    wifi = models.BooleanField(default=False)
    tv = models.BooleanField(default=False)
    whiteboard = models.BooleanField(default=False)
    speaker = models.BooleanField(default=False)
    mic = models.BooleanField(default=False)
    extension_power_box = models.BooleanField(default=False)
    stationaries = models.BooleanField(default=False)
    chairs_tables = models.BooleanField(default=False) 


    def __str__(self):
        return f"{self.hall_code} - {self.hall_name}"
class BlockedDate(models.Model):
    office = models.ForeignKey(OfficeMaster, on_delete=models.CASCADE)
    hall = models.ForeignKey(HallMaster, on_delete=models.CASCADE, null=True, blank=True)
    blocked_date = models.DateField()
    reason = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('AdminUser', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        unique_together = ('office', 'hall', 'blocked_date')

    def __str__(self):
        if self.hall:
            return f"{self.hall.hall_name} - {self.blocked_date}"
        return f"{self.office.office_name} - {self.blocked_date}"

class SessionMaster(models.Model):
    hall = models.ForeignKey(HallMaster, on_delete=models.CASCADE,null=True, blank=True)
    session_code = models.CharField(max_length=50, unique=True)
    session_type = models.CharField(max_length=100)
    preferred_hall_1 = models.ForeignKey(HallMaster, on_delete=models.SET_NULL, null=True, blank=True, related_name='preferred_hall_1')
    preferred_hall_2 = models.ForeignKey(HallMaster, on_delete=models.SET_NULL, null=True, blank=True, related_name='preferred_hall_2')
    preferred_hall_3 = models.ForeignKey(HallMaster, on_delete=models.SET_NULL, null=True, blank=True, related_name='preferred_hall_3')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.session_code} - {self.session_type}"

class Infrastructure(models.Model):
    hall = models.ForeignKey(HallMaster, on_delete=models.CASCADE,null=True, blank=True)
    infra_code = models.CharField(max_length=50, unique=True)
    infra_type = models.CharField(max_length=100)
    infra_item = models.CharField(max_length=200)
    nos_in_stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.infra_code} - {self.infra_item}"

class SlotMaster(models.Model):
    SLOT_STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Booked', 'Booked'),
    ]
    
    slot_date = models.DateField()
    hall = models.ForeignKey(HallMaster, on_delete=models.CASCADE)
    slot_time = models.CharField(max_length=50)
    slot_status = models.CharField(max_length=20, choices=SLOT_STATUS_CHOICES, default='Available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    class Meta:
        unique_together = ('slot_date', 'slot_time')

    def __str__(self):
        return f"{self.slot_date} - {self.slot_time}"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Cancelled', 'Cancelled'),
        ('Rejected', 'Rejected'),
    ]

    SHIFT_CHOICES = [
        ('Day', 'Day'),
        ('Mid', 'Mid'),
        ('Night', 'Night'),
    ]
    
    book_date = models.DateField(auto_now_add=True)
    slot_date = models.DateField()
    slot_time = models.CharField(max_length=50)
    office = models.ForeignKey(OfficeMaster, on_delete=models.CASCADE)
    hall = models.ForeignKey(HallMaster, on_delete=models.CASCADE)
    session = models.ForeignKey(SessionMaster, on_delete=models.CASCADE, default='meeting')
    emp_code = models.CharField(max_length=50)
    emp_name = models.CharField(max_length=200)
    emp_email_id = models.EmailField()
    emp_mobile_no = models.CharField(max_length=15)
    team_name = models.CharField(max_length=200)
    shift = models.CharField(max_length=10, choices=SHIFT_CHOICES, default='Day')
    it_support = models.BooleanField(default=False)
    hr_support = models.BooleanField(default=False)
    fin_support = models.BooleanField(default=False)
    caf_support = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    approved = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.emp_code} - {self.slot_date} - {self.slot_time}"

    def save(self, *args, **kwargs):
        # Auto-set approved based on status
        if self.status == 'Approved':
            self.approved = True
        elif self.status == 'Rejected':
            self.approved = False
        else:
            self.approved = False
        super().save(*args, **kwargs)
        

class EmailOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        from django.utils import timezone
        from datetime import timedelta
        return timezone.now() > self.created_at + timedelta(minutes=5)

    def __str__(self):
        return f"{self.email} - {self.otp}"
