from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('offices', views.OfficeMasterViewSet)
router.register('admin-users', views.AdminUserViewSet)
router.register('entities', views.EntityViewSet)
router.register('halls', views.HallMasterViewSet)
router.register('sessions', views.SessionMasterViewSet)
router.register('infrastructure', views.InfrastructureViewSet)
router.register('slots', views.SlotMasterViewSet)
router.register('bookings', views.BookingViewSet)
router.register('blocked-dates', views.BlockedDateViewSet)

urlpatterns = [
    path('', include(router.urls)),
path('booking-stats/', views.BookingViewSet.as_view({'get': 'stats'}), name='booking-stats'),
    # Additional custom endpoints
    path('halls/<int:pk>/bookings/', views.HallMasterViewSet.as_view({'get': 'bookings'}), name='hall-bookings'),
    path('halls/<int:pk>/booked_slots/', views.HallMasterViewSet.as_view({'get': 'booked_slots'}), name='hall-booked-slots'),
    path('available-halls/', views.HallMasterViewSet.as_view({'get': 'available'}), name='available-halls'),
    path('available-slots/', views.SlotMasterViewSet.as_view({'get': 'available'}), name='available-slots'),
    path('employee-bookings/', views.BookingViewSet.as_view({'get': 'employee'}), name='employee-bookings'),
    path('upcoming-bookings/', views.BookingViewSet.as_view({'get': 'upcoming'}), name='upcoming-bookings'),
    # OTP endpoints
    path('send-otp/', views.send_otp, name='send-otp'),
    path('verify-otp/', views.verify_otp, name='verify-otp'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard-stats'),
    path('current-working-halls/', views.current_working_halls, name='current-working-halls'),
    path('pending-approvals/', views.pending_approvals, name='pending-approvals'),
    path('bookings-by-email/', views.BookingViewSet.as_view({'get': 'by_email'}), name='bookings-by-email'),
    path('hall-categories/', views.hall_categories, name='hall-categories'),
]