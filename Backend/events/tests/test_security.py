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
