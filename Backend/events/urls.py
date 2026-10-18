from django.urls import path
from . import views

urlpatterns = [
    # Countdown & Event info
    path('countdown/', views.countdown, name='countdown'),
    path('public/countdown/', views.countdown, name='public-countdown'),

    # Stage 1: Form 1 Registration & PPT submission
    path('register/', views.register, name='register'),
    path('public/register/', views.register, name='public-register'),
    path('verify-email/', views.verify_email, name='verify-email'),
    path('public/verify-email/', views.verify_email, name='public-verify-email'),

    # Stage 2: Form 2 Payment (Gated by payment_token for selected teams)
    path('payment-details/<uuid:payment_token>/', views.payment_details, name='payment-details'),
    path('public/payment-details/<uuid:payment_token>/', views.payment_details, name='public-payment-details'),
    path('create-order/', views.create_order, name='create-order'),
    path('create-order/<uuid:payment_token>/', views.create_order, name='create-order-with-token'),
    path('public/create-order/', views.create_order, name='public-create-order'),
    path('public/create-order/<uuid:payment_token>/', views.create_order, name='public-create-order-with-token'),
    path('verify-payment/', views.verify_payment, name='verify-payment'),
    path('public/verify-payment/', views.verify_payment, name='public-verify-payment'),

    # Razorpay Webhook (authoritative server-to-server reconciliation)
    path('webhook/razorpay/', views.razorpay_webhook, name='razorpay-webhook'),

    # Status inquiry (supports path parameter or query string)
    path('registration-status/', views.registration_status, name='registration-status'),
    path('registration-status/<uuid:status_token>/', views.registration_status, name='registration-status-with-token'),
    path('public/registration-status/', views.registration_status, name='public-registration-status'),
    path('public/registration-status/<uuid:status_token>/', views.registration_status, name='public-registration-status-with-token'),
]
