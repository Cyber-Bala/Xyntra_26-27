import hashlib
import hmac
import json
from datetime import timedelta
from decimal import Decimal

from django.test import override_settings
from django.utils import timezone

from ..models import Payment, Team
from .base import BaseTestCase

WEBHOOK_SECRET = 'test_webhook_secret_key_12345'


def _generate_webhook_signature(body_str: str, secret: str = WEBHOOK_SECRET) -> str:
    """Computes valid Razorpay webhook HMAC-SHA256 signature."""
    return hmac.new(
        secret.encode('utf-8'),
        body_str.encode('utf-8'),
        hashlib.sha256,
    ).hexdigest()


@override_settings(RAZORPAY_WEBHOOK_SECRET=WEBHOOK_SECRET)
class RazorpayWebhookTests(BaseTestCase):

    def setUp(self):
        super().setUp()
        self._register_team(team_name='WebhookTeam')
        self.team = Team.objects.get(team_name='WebhookTeam')
        self.team.selection_status = Team.SelectionStatus.SELECTED
        self.team.email_verified = True
        self.team.payment_token_expires_at = timezone.now() + timedelta(days=7)
        self.team.save()

        self.payment = Payment.objects.create(
            team=self.team,
            razorpay_order_id='order_webhook_001',
            amount=Decimal('2000.00'),
            status=Payment.PaymentStatus.CREATED,
        )

    def _post_webhook(self, payload_dict, signature=None, header_name='HTTP_X_RAZORPAY_SIGNATURE'):
        body = json.dumps(payload_dict)
        if signature is None:
            signature = _generate_webhook_signature(body)

        extra = {}
        if signature:
            extra[header_name] = signature

        return self.client.post(
            '/api/webhook/razorpay/',
            data=body,
            content_type='application/json',
            **extra,
        )

    # --- Signature & Header validation -------------------------------------

    def test_missing_signature_header_rejected(self):
        """Webhooks missing X-Razorpay-Signature header must return 400."""
        res = self.client.post(
            '/api/webhook/razorpay/',
            data=json.dumps({'event': 'payment.captured'}),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("Missing X-Razorpay-Signature", res.json()['error'])

    def test_invalid_signature_rejected(self):
        """Webhooks with an invalid HMAC signature must return 400."""
        res = self._post_webhook(
            {'event': 'payment.captured'},
            signature='invalid_hex_signature',
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("Invalid webhook signature", res.json()['error'])

    @override_settings(RAZORPAY_WEBHOOK_SECRET='')
    def test_unconfigured_webhook_secret_returns_503(self):
        """If RAZORPAY_WEBHOOK_SECRET is not configured, return 503."""
        res = self.client.post(
            '/api/webhook/razorpay/',
            data=json.dumps({'event': 'payment.captured'}),
            content_type='application/json',
            HTTP_X_RAZORPAY_SIGNATURE='any_signature',
        )
        self.assertEqual(res.status_code, 503)
        self.assertIn("Webhook secret is not configured", res.json()['error'])

    def test_malformed_json_body_rejected(self):
        """Invalid JSON with valid signature must return 400."""
        malformed_body = "{invalid json string"
        sig = _generate_webhook_signature(malformed_body)
        res = self.client.post(
            '/api/webhook/razorpay/',
            data=malformed_body,
            content_type='application/json',
            HTTP_X_RAZORPAY_SIGNATURE=sig,
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("Invalid JSON", res.json()['error'])

    # --- payment.captured happy path ---------------------------------------

    def test_payment_captured_success(self):
        """Authoritative payment.captured event marks payment PAID and team is_paid=True."""
        payload = {
            "entity": "event",
            "event": "payment.captured",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_hook_captured_123",
                        "order_id": "order_webhook_001",
                        "amount": 200000,
                        "currency": "INR",
                        "status": "captured",
                    }
                }
            }
        }
        res = self._post_webhook(payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data['status'], 'success')
        self.assertTrue(data['is_paid'])

        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, Payment.PaymentStatus.PAID)
        self.assertEqual(self.payment.razorpay_payment_id, "pay_hook_captured_123")

        self.team.refresh_from_db()
        self.assertTrue(self.team.is_paid)

    # --- order.paid happy path ---------------------------------------------

    def test_order_paid_success(self):
        """order.paid event also reconciles and marks payment and team as paid."""
        payload = {
            "entity": "event",
            "event": "order.paid",
            "payload": {
                "order": {
                    "entity": {
                        "id": "order_webhook_001",
                        "amount": 200000,
                        "amount_paid": 200000,
                        "currency": "INR",
                        "status": "paid",
                    }
                },
                "payment": {
                    "entity": {
                        "id": "pay_hook_order_paid_456",
                        "order_id": "order_webhook_001",
                        "amount": 200000,
                        "currency": "INR",
                        "status": "captured",
                    }
                }
            }
        }
        res = self._post_webhook(payload)
        self.assertEqual(res.status_code, 200)

        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, Payment.PaymentStatus.PAID)
        self.team.refresh_from_db()
        self.assertTrue(self.team.is_paid)

    # --- Idempotency -------------------------------------------------------

    def test_webhook_idempotency(self):
        """Duplicate webhook delivery returns 200 without modifying already-paid state."""
        self.payment.status = Payment.PaymentStatus.PAID
        self.payment.razorpay_payment_id = "pay_already_processed"
        self.payment.save()
        self.team.is_paid = True
        self.team.save()

        payload = {
            "event": "payment.captured",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_duplicate_delivery",
                        "order_id": "order_webhook_001",
                        "amount": 200000,
                        "currency": "INR",
                        "status": "captured",
                    }
                }
            }
        }
        res = self._post_webhook(payload)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['status'], 'already_processed')

        # Existing payment id preserved
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.razorpay_payment_id, "pay_already_processed")

    # --- Reconciliation failures -------------------------------------------

    def test_webhook_amount_mismatch(self):
        """Webhook with wrong amount must be rejected with 400."""
        payload = {
            "event": "payment.captured",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_mismatch_amount",
                        "order_id": "order_webhook_001",
                        "amount": 100000,  # 1000 INR instead of 2000 INR
                        "currency": "INR",
                        "status": "captured",
                    }
                }
            }
        }
        res = self._post_webhook(payload)
        self.assertEqual(res.status_code, 400)
        self.assertIn("reconciled", res.json()['error'])

        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, Payment.PaymentStatus.CREATED)
        self.team.refresh_from_db()
        self.assertFalse(self.team.is_paid)

    def test_webhook_currency_mismatch(self):
        """Webhook with currency other than INR must be rejected with 400."""
        payload = {
            "event": "payment.captured",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_wrong_curr",
                        "order_id": "order_webhook_001",
                        "amount": 200000,
                        "currency": "USD",
                        "status": "captured",
                    }
                }
            }
        }
        res = self._post_webhook(payload)
        self.assertEqual(res.status_code, 400)
        self.assertIn("Currency mismatch", res.json()['error'])

    def test_webhook_order_not_found(self):
        """Unknown order_id returns 200 with ignored status so Razorpay doesn't retry."""
        payload = {
            "event": "payment.captured",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_unknown_order",
                        "order_id": "order_non_existent",
                        "amount": 200000,
                        "currency": "INR",
                        "status": "captured",
                    }
                }
            }
        }
        res = self._post_webhook(payload)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['status'], 'ignored')

    # --- payment.failed handling -------------------------------------------

    def test_webhook_payment_failed(self):
        """payment.failed event transitions Payment status to FAILED."""
        payload = {
            "event": "payment.failed",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_failed_123",
                        "order_id": "order_webhook_001",
                        "amount": 200000,
                        "currency": "INR",
                        "status": "failed",
                    }
                }
            }
        }
        res = self._post_webhook(payload)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['status'], 'recorded_failure')

        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, Payment.PaymentStatus.FAILED)
        self.team.refresh_from_db()
        self.assertFalse(self.team.is_paid)

    # --- Ignored events -----------------------------------------------------

    def test_webhook_unhandled_event_ignored(self):
        """Events like refund.processed or order.created return 200 ignored."""
        payload = {
            "event": "refund.processed",
            "payload": {},
        }
        res = self._post_webhook(payload)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['status'], 'ignored')
