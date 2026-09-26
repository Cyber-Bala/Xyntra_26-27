"""
Django settings for xyntra project.
Production-ready configuration for Render deployment with WhiteNoise,
PostgreSQL, Razorpay, and decoupled frontend CORS support.
"""

import os
from pathlib import Path
from urllib.parse import urlparse

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv
import dj_database_url

# Load local environment variables from .env file if present
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# ---------------------------------------------------------------------------
# Core security settings
# ---------------------------------------------------------------------------

def _required_env(name: str) -> str:
    """Return an environment variable or raise ImproperlyConfigured."""
    value = os.environ.get(name)
    if not value:
        raise ImproperlyConfigured(f"{name} must be configured.")
    return value


DEBUG = os.environ.get('DEBUG', 'False').lower() in ('true', '1', 'yes')

SECRET_KEY = _required_env('SECRET_KEY')

if DEBUG and os.environ.get('ENVIRONMENT') == 'production':
    raise ImproperlyConfigured("DEBUG must be False in production.")

ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get(
        'ALLOWED_HOSTS', 'localhost,127.0.0.1,.onrender.com,testserver'
    ).split(',')
    if host.strip()
]


# ---------------------------------------------------------------------------
# Application definition
# ---------------------------------------------------------------------------

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'corsheaders',

    # Custom apps
    'events',
]

MIDDLEWARE = [
    # CORS middleware must be placed as high as possible, especially before CommonMiddleware
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # WhiteNoise for static files
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'events.middleware.RatelimitMiddleware',
]

ROOT_URLCONF = 'xyntra.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'xyntra.wsgi.application'


# ---------------------------------------------------------------------------
# Database: PostgreSQL on Render, SQLite locally
# ---------------------------------------------------------------------------

DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
        conn_health_checks=True,
    )
}


# ---------------------------------------------------------------------------
# Password validation
# ---------------------------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ---------------------------------------------------------------------------
# Internationalization
# ---------------------------------------------------------------------------

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ---------------------------------------------------------------------------
# Static files (CSS, JavaScript, Images)
# ---------------------------------------------------------------------------

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# Media files (Uploaded PPTs)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ---------------------------------------------------------------------------
# CORS — pin to explicit FRONTEND_URL only
# ---------------------------------------------------------------------------

FRONTEND_URL = os.environ.get('FRONTEND_URL', '').strip()

if not FRONTEND_URL and not DEBUG:
    raise ImproperlyConfigured("FRONTEND_URL is required in production.")

if not FRONTEND_URL:
    FRONTEND_URL = 'http://localhost:3000'

_parsed_frontend = urlparse(FRONTEND_URL)
if _parsed_frontend.scheme != 'https' and not DEBUG:
    raise ImproperlyConfigured("Production FRONTEND_URL must use HTTPS.")

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = [FRONTEND_URL]
if DEBUG:
    CORS_ALLOWED_ORIGINS += [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
    ]
    # Deduplicate.
    CORS_ALLOWED_ORIGINS = list(dict.fromkeys(CORS_ALLOWED_ORIGINS))

CSRF_TRUSTED_ORIGINS = list(CORS_ALLOWED_ORIGINS)


# ---------------------------------------------------------------------------
# Email Configuration (SMTP Gmail)
# ---------------------------------------------------------------------------

EMAIL_BACKEND = os.environ.get(
    'EMAIL_BACKEND',
    'django.core.mail.backends.console.EmailBackend'
    if DEBUG
    else 'django.core.mail.backends.smtp.EmailBackend',
)
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.environ.get(
    'DEFAULT_FROM_EMAIL', EMAIL_HOST_USER or 'noreply@xyntra.com'
)
EMAIL_TIMEOUT = 10  # Seconds; prevents stalled SMTP from blocking workers.


# ---------------------------------------------------------------------------
# Razorpay Configuration
# ---------------------------------------------------------------------------

RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')
RAZORPAY_WEBHOOK_SECRET = os.environ.get('RAZORPAY_WEBHOOK_SECRET', '')
# (connect_timeout, read_timeout) in seconds for Razorpay API calls.
RAZORPAY_TIMEOUT = (3.05, 10)

if not DEBUG and (not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET):
    raise ImproperlyConfigured(
        "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required in production."
    )


# ---------------------------------------------------------------------------
# Production-only hardening
# ---------------------------------------------------------------------------

SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

if not DEBUG:
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
