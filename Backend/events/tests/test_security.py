import json
from unittest.mock import MagicMock

from django.core.exceptions import ValidationError
from django.http import HttpResponse

from ..views.validators import (
    _reject_oversized_request,
    _require_bool,
    _require_string,
)
from .base import BaseTestCase


class SecurityTests(BaseTestCase):
    def test_oversized_request_rejected(self):
        """Requests exceeding 40 MB content length header must return 413."""
        fake_request = MagicMock()
        fake_request.META = {"CONTENT_LENGTH": str(50 * 1024 * 1024)}
        response = _reject_oversized_request(fake_request)
        self.assertIsNotNone(response)
        self.assertEqual(response.status_code, 413)

    def test_invalid_content_length_rejected(self):
        """Malformed Content-Length headers must return 400."""
        fake_request = MagicMock()
        fake_request.META = {"CONTENT_LENGTH": "not-an-integer"}
        response = _reject_oversized_request(fake_request)
        self.assertIsNotNone(response)
        self.assertEqual(response.status_code, 400)

    def test_normal_sized_request_permitted(self):
        """Requests within normal size bounds must return None."""
        fake_request = MagicMock()
        fake_request.META = {"CONTENT_LENGTH": "1024"}
        response = _reject_oversized_request(fake_request)
        self.assertIsNone(response)

    def test_require_string_validation(self):
        """Validates string type, trimming, and maximum length."""
        self.assertEqual(_require_string("  valid  ", "field", 50), "valid")

        with self.assertRaises(ValidationError):
            _require_string(12345, "field", 50)

        with self.assertRaises(ValidationError):
            _require_string("", "field", 50)

        with self.assertRaises(ValidationError):
            _require_string("toolong", "field", 5)

    def test_require_bool_validation(self):
        """Validates strict boolean type without string coercion."""
        self.assertTrue(_require_bool(True, "field"))
        self.assertFalse(_require_bool(False, "field"))

        with self.assertRaises(ValidationError):
            _require_bool("true", "field")

        with self.assertRaises(ValidationError):
            _require_bool(1, "field")

        with self.assertRaises(ValidationError):
            _require_bool(None, "field")

    # --- Rate limiting tests -----------------------------------------------

    def test_register_rate_limiting(self):
        """POST /api/register/ is throttled after 5 requests/minute per IP, returning 429."""
        from django.core.cache import cache
        from django.test import override_settings

        cache.clear()
        with override_settings(RATELIMIT_ENABLE=True):
            # Send 5 requests (allowed)
            for i in range(5):
                resp = self.client.post('/api/register/', {})
                self.assertNotEqual(resp.status_code, 429)

            # 6th request should be blocked by django-ratelimit and handled as 429
            resp = self.client.post('/api/register/', {})
            self.assertEqual(resp.status_code, 429)
            data = resp.json()
            self.assertIn("error", data)
            self.assertEqual(data["status"], 429)
        cache.clear()

    def test_create_order_rate_limiting(self):
        """POST /api/create-order/ is throttled after 5 requests/minute per IP."""
        import uuid
        from django.core.cache import cache
        from django.test import override_settings

        cache.clear()
        with override_settings(RATELIMIT_ENABLE=True):
            dummy_token = str(uuid.uuid4())
            for i in range(5):
                resp = self.client.post(
                    '/api/create-order/',
                    data=json.dumps({'payment_token': dummy_token}),
                    content_type='application/json',
                )
                self.assertNotEqual(resp.status_code, 429)

            resp = self.client.post(
                '/api/create-order/',
                data=json.dumps({'payment_token': dummy_token}),
                content_type='application/json',
            )
            self.assertEqual(resp.status_code, 429)
        cache.clear()

    def test_verify_email_rate_limiting(self):
        """POST /api/verify-email/ is throttled after 10 requests/minute per IP."""
        import uuid
        from django.core.cache import cache
        from django.test import override_settings

        cache.clear()
        with override_settings(RATELIMIT_ENABLE=True):
            dummy_token = str(uuid.uuid4())
            for i in range(10):
                resp = self.client.post(
                    '/api/verify-email/',
                    data=json.dumps({'token': dummy_token}),
                    content_type='application/json',
                )
                self.assertNotEqual(resp.status_code, 429)

            resp = self.client.post(
                '/api/verify-email/',
                data=json.dumps({'token': dummy_token}),
                content_type='application/json',
            )
            self.assertEqual(resp.status_code, 429)
        cache.clear()

