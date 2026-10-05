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

    def test_get_client_ip_helper(self):
        """get_client_ip correctly handles X-Forwarded-For, ports, and fallbacks."""
        from ..middleware import get_client_ip

        req = MagicMock()
        # Single IPv4 in XFF
        req.META = {'HTTP_X_FORWARDED_FOR': '203.0.113.195', 'REMOTE_ADDR': '10.0.0.1'}
        self.assertEqual(get_client_ip(req), '203.0.113.195')

        # Multiple IPs in XFF (client, proxy1, proxy2)
        req.META = {'HTTP_X_FORWARDED_FOR': '203.0.113.195, 70.41.3.18, 150.172.238.178', 'REMOTE_ADDR': '10.0.0.1'}
        self.assertEqual(get_client_ip(req), '203.0.113.195')

        # IPv4 with port in XFF
        req.META = {'HTTP_X_FORWARDED_FOR': '203.0.113.195:8080', 'REMOTE_ADDR': '10.0.0.1'}
        self.assertEqual(get_client_ip(req), '203.0.113.195')

        # IPv6 bracketed with port in XFF
        req.META = {'HTTP_X_FORWARDED_FOR': '[2001:db8::1]:8080', 'REMOTE_ADDR': '10.0.0.1'}
        self.assertEqual(get_client_ip(req), '2001:db8::1')

        # Fallback to REMOTE_ADDR when XFF is absent
        req.META = {'REMOTE_ADDR': '198.51.100.22'}
        self.assertEqual(get_client_ip(req), '198.51.100.22')

        # Fallback to 127.0.0.1 when both are absent
        req.META = {}
        self.assertEqual(get_client_ip(req), '127.0.0.1')

    def test_reverse_proxy_distinct_client_rate_limiting(self):
        """
        Distinct clients behind a reverse proxy (sharing REMOTE_ADDR but differing in
        X-Forwarded-For) get separate rate limit buckets, preventing collective lockouts.
        """
        from django.core.cache import cache
        from django.test import override_settings

        cache.clear()
        with override_settings(RATELIMIT_ENABLE=True):
            # Client A exhausts their 5 requests quota
            for i in range(5):
                resp = self.client.post(
                    '/api/register/',
                    {},
                    HTTP_X_FORWARDED_FOR='203.0.113.10',
                    REMOTE_ADDR='10.0.0.1',  # Proxy IP
                )
                self.assertNotEqual(resp.status_code, 429)

            # Client A 6th request is throttled
            resp_a = self.client.post(
                '/api/register/',
                {},
                HTTP_X_FORWARDED_FOR='203.0.113.10',
                REMOTE_ADDR='10.0.0.1',
            )
            self.assertEqual(resp_a.status_code, 429)

            # Client B comes from the SAME proxy IP but with a DIFFERENT client IP
            # Client B must NOT be blocked by Client A's activity!
            resp_b = self.client.post(
                '/api/register/',
                {},
                HTTP_X_FORWARDED_FOR='198.51.100.50',
                REMOTE_ADDR='10.0.0.1',
            )
            self.assertNotEqual(resp_b.status_code, 429)
        cache.clear()


