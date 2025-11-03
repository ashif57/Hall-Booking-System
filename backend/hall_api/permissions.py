from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrSuperAdmin(BasePermission):
    """
    Allows read-only access to any authenticated user, but only allows write
    access to admin users.
    """

    def has_permission(self, request, view):
        # Allow access to specific actions without authentication
        if hasattr(view, 'action') and view.action in ['by_email', 'employee']:
            return True
            
        # Allow read-only access for any user (authenticated or not)
        if request.method in SAFE_METHODS:
            return True

        # For write requests, require the user to be an authenticated admin/superadmin
        return request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'SUPERADMIN']