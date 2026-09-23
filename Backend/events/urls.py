from django.urls import path
from . import views

urlpatterns = [
    # Countdown & Event info
    path('countdown/', views.countdown, name='countdown'),

    # Stage 1: Form 1 Registration & PPT submission
    path('register/', views.register, name='register'),
    # Email verification — now POST-only (token in request body, not URL).
    path('verify-email/', views.verify_email, name='verify-email'),

    # Stage 2: Form 2 Payment (Gated by payment_token for selected teams)
    path('payment-details/<uuid:payment_token>/', views.payment_details, name='payment-details'),
    path('create-order/', views.create_order, name='create-order'),
    path('verify-payment/', views.verify_payment, name='verify-payment'),

    # Status inquiry (uses opaque status_token query parameter)
    path('registration-status/', views.registration_status, name='registration-status'),
]
