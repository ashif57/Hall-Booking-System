from django.contrib import admin
from .models import (
    Entity, OfficeMaster, AdminUser, HallMaster, 
    SessionMaster, Infrastructure, SlotMaster, Booking
)

admin.site.register(Entity)
admin.site.register(OfficeMaster)
admin.site.register(AdminUser)
admin.site.register(HallMaster)
admin.site.register(SessionMaster)
admin.site.register(Infrastructure)
admin.site.register(SlotMaster)
admin.site.register(Booking)