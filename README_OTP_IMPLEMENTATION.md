# Email OTP Verification Implementation

This document describes the implementation of Email OTP verification for the Django + React hall booking system.

## Features Implemented

1. **Django Backend**:
   - EmailOTP model with email, otp, and created_at fields
   - OTP expiration in 5 minutes
   - Domain restriction for specific domains (e.g., @corptinc.com)
   - 6-digit OTP generation
   - Email sending via Gmail SMTP
   - API endpoints for sending and verifying OTP

2. **React Frontend**:
   - Two-step verification component
   - Email input and OTP input forms
   - Success/error messaging
   - Resend OTP functionality

## Django Implementation

### Models

The `EmailOTP` model is defined in `backend/hall_api/models.py`:

```python
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
```

### Utility Functions

Utility functions are implemented in `backend/hall_api/utils.py`:

1. `is_allowed_domain(email)` - Checks if the email domain is allowed
2. `generate_otp()` - Generates a random 6-digit OTP
3. `send_otp_via_email(email, otp)` - Sends OTP via email using Django's email backend

### API Endpoints

API views are implemented in `backend/hall_api/views.py`:

1. `/api/send-otp/` - Validates email domain, generates OTP, saves to DB, sends email
2. `/api/verify-otp/` - Verifies OTP from DB, checks expiration, deletes after successful verification

### URL Configuration

URL patterns are configured in `backend/hall_api/urls.py`:

```python
path('send-otp/', views.send_otp, name='send-otp'),
path('verify-otp/', views.verify_otp, name='verify-otp'),
```

## React Implementation

### OTP Verification Component

The `OTPVerification` component is implemented in `Frontend 1/src/components/OTPVerification.jsx` with:

1. Two-step process:
   - Step 1: Email input and send OTP
   - Step 2: OTP input and verification
2. Loading states and error handling
3. Resend OTP functionality
4. Domain restriction messaging

### API Integration

API functions are added to `Frontend 1/src/api/axios.js`:

```javascript
export const sendOTP = async (email) => { ... }
export const verifyOTP = async (email, otp) => { ... }
```

### Test Page

A test page is available at `/otp-test` route.

## Configuration

### Email Settings

Email configuration is added to `backend/backend/settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'your-email@gmail.com'
```

## Security Features

1. OTP expires in 5 minutes
2. OTP is deleted after successful verification
3. Domain restriction for email addresses
4. Proper error handling for expired/invalid OTPs

## Usage

1. Navigate to `/otp-test` in the React app
2. Enter an email with an allowed domain (e.g., @corpinc.com)
3. Receive OTP via email
4. Enter OTP to verify
5. Proceed with the booking process after successful verification

## Testing

To test the implementation:

1. Start the Django backend server
2. Start the React frontend server
3. Navigate to http://localhost:5173/otp-test
4. Enter a test email with the allowed domain
5. Check email for OTP
6. Enter OTP and verify

## Customization

To customize the implementation:

1. Update allowed domains in `backend/hall_api/utils.py`
2. Modify email settings in `backend/backend/settings.py`
3. Adjust OTP expiration time in `backend/hall_api/models.py`
4. Update UI styling in the React component as needed


 what each of those fields in Django’s `settings.py` mean and **how you actually get the values**:

---

## 📩 Django Email Settings Breakdown

```python
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'your-email@gmail.com'
```

### 1. **EMAIL\_HOST\_USER**

* This is the **email address** you’ll use to send emails.
* Example: `"mycompanymail@gmail.com"`
* It must match the Gmail account (or whichever provider you use).

---

### 2. **EMAIL\_HOST\_PASSWORD**

* This is **not your Gmail password** ❌.
* For Gmail, you must generate a special **App Password**.

👉 Steps to get Gmail App Password:

1. Go to [Google Account Security](https://myaccount.google.com/security).
2. Enable **2-Step Verification** (if not already).
3. Under **“App Passwords”**, create a new one.

   * Select **App → Mail**
   * Select **Device → Other (give a name, e.g., Django App)**
   * Google will show you a **16-character password** (like `abcd efgh ijkl mnop`).
4. Copy that and paste it in:

   ```python
   EMAIL_HOST_PASSWORD = "abcd efgh ijkl mnop"
   ```

This allows Django to send emails securely without exposing your real Gmail login. ✅

---

### 3. **DEFAULT\_FROM\_EMAIL**

* This is the **sender email** that will appear in the user’s inbox.
* Usually the same as `EMAIL_HOST_USER`.
* Example: `"no-reply@mycompany.com"` or `"your-email@gmail.com"`.

---

## 🔑 Example (for Gmail SMTP)

```python
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_HOST_USER = "mycompanymail@gmail.com"         # Your Gmail address
EMAIL_HOST_PASSWORD = "abcd efgh ijkl mnop"        # App password (not real login)
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER               # Same as sender
```

---



---
