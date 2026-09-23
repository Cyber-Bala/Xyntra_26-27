import json
from datetime import timedelta
from decimal import Decimal
from unittest.mock import MagicMock, patch

from django.utils import timezone
from razorpay.errors import SignatureVerificationError

from ..admin import select_and_send_payment_links
from ..models import Payment, Team
from .base import BaseTestCase


class PaymentFlowTests(BaseTestCase):
    # --- Payment gating (Form 2) -------------------------------------------

    def test_form2_payment_gatekeepers(self):
        self._register_team(team_name='GatedTeam')
        team = Team.objects.get(team_name='GatedTeam')

        # 1. PENDING → payment_details returns 403.
        res = self.client.get(f'/api/payment-details/{team.payment_token}/')
        self.assertEqual(res.status_code, 403)

        # 2. PENDING → create-order returns 403.
        res = self.client.post(
            '/api/create-order/',
            data=json.dumps({'payment_token': str(team.payment_token)}),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 403)

        # 3. Verify email.
        self.client.post(
            '/api/verify-email/',
            data=json.dumps({'token': str(team.email_token)}),
            content_type='application/json',
        )

        # 4. Select via admin action.
        fake_request = MagicMock()
        fake_modeladmin = MagicMock()
        select_and_send_payment_links(fake_modeladmin, fake_request, Team.objects.filter(id=team.id))

        team.refresh_from_db()
        self.assertEqual(team.selection_status, Team.SelectionStatus.SELECTED)
        self.assertIsNotNone(team.payment_token_expires_at)

        # 5. payment_details returns 200 with pricing.
        res = self.client.get(f'/api/payment-details/{team.payment_token}/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data['selection_status'], 'selected')
        self.assertEqual(data['amount_inr'], '2000.00')

        # 6. create-order succeeds (mock Razorpay).
        with patch('events.services.razorpay.get_razorpay_client') as mock_get_client:
            mock_inst = MagicMock()
            mock_inst.order.create.return_value = {
                'id': 'order_test_123',
                'amount': 200000,
                'currency': 'INR',
            }
            mock_get_client.return_value = mock_inst

            res = self.client.post(
                '/api/create-order/',
                data=json.dumps({'payment_token': str(team.payment_token)}),
                content_type='application/json',
            )
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json()['order_id'], 'order_test_123')

    def test_create_order_idempotent(self):
        """Second create-order call returns existing order instead of creating a new one."""
        self._register_team(team_name='IdempotentTeam')
        team = Team.objects.get(team_name='IdempotentTeam')

        # Verify email.
        self.client.post(
            '/api/verify-email/',
            data=json.dumps({'token': str(team.email_token)}),
            content_type='application/json',
        )
        # Select the team (as admin would).
        team.refresh_from_db()
        team.selection_status = Team.SelectionStatus.SELECTED
        team.payment_token_expires_at = timezone.now() + timedelta(days=7)
        team.save(update_fields=['selection_status', 'payment_token_expires_at', 'updated_at'])

        with patch('events.services.razorpay.get_razorpay_client') as mock_get_client:
            mock_inst = MagicMock()
            mock_inst.order.create.return_value = {
                'id': 'order_first_123',
                'amount': 200000,
                'currency': 'INR',
            }
            mock_get_client.return_value = mock_inst

            # First call creates the order.
            res1 = self.client.post(
                '/api/create-order/',
                data=json.dumps({'payment_token': str(team.payment_token)}),
                content_type='application/json',
            )
            self.assertEqual(res1.status_code, 200)

        # Second call should reuse, not create again.
        with patch('events.services.razorpay.get_razorpay_client') as mock_get_client2:
            mock_inst2 = MagicMock()
            mock_get_client2.return_value = mock_inst2

            res2 = self.client.post(
                '/api/create-order/',
                data=json.dumps({'payment_token': str(team.payment_token)}),
                content_type='application/json',
            )
            self.assertEqual(res2.status_code, 200)
            self.assertEqual(res2.json()['order_id'], 'order_first_123')
            mock_inst2.order.create.assert_not_called()

    # --- Payment verification with reconciliation --------------------------

    def test_verify_payment_reconciliation_success(self):
        """Full happy-path: signature OK, provider confirms captured, amount matches."""
        self._register_team(team_name='PayTeam')
        team = Team.objects.get(team_name='PayTeam')
        team.selection_status = Team.SelectionStatus.SELECTED
        team.email_verified = True
        team.payment_token_expires_at = timezone.now() + timedelta(days=7)
        team.save()

        Payment.objects.create(
            team=team,
            razorpay_order_id='order_pay_001',
            amount=Decimal('2000.00'),
            status=Payment.PaymentStatus.CREATED,
        )

        with patch('events.services.razorpay.get_razorpay_client') as mock_get_client:
            mock_inst = MagicMock()
            mock_inst.utility.verify_payment_signature.return_value = None
            mock_inst.payment.fetch.return_value = {
                'order_id': 'order_pay_001',
                'currency': 'INR',
                'status': 'captured',
                'amount': 200000,
            }
            mock_get_client.return_value = mock_inst

            res = self.client.post(
                '/api/verify-payment/',
                data=json.dumps({
                    'razorpay_order_id': 'order_pay_001',
                    'razorpay_payment_id': 'pay_xyz',
                    'razorpay_signature': 'sig_abc',
                }),
                content_type='application/json',
            )
            self.assertEqual(res.status_code, 200)
            self.assertTrue(res.json()['is_paid'])

        team.refresh_from_db()
        self.assertTrue(team.is_paid)

    def test_verify_payment_amount_mismatch(self):
        """Provider reports a different amount → reject."""
        self._register_team(team_name='MismatchTeam')
        team = Team.objects.get(team_name='MismatchTeam')
        team.selection_status = Team.SelectionStatus.SELECTED
        team.email_verified = True
        team.save()

        Payment.objects.create(
            team=team,
            razorpay_order_id='order_mm_001',
            amount=Decimal('2000.00'),
            status=Payment.PaymentStatus.CREATED,
        )

        with patch('events.services.razorpay.get_razorpay_client') as mock_get_client:
            mock_inst = MagicMock()
            mock_inst.utility.verify_payment_signature.return_value = None
            mock_inst.payment.fetch.return_value = {
                'order_id': 'order_mm_001',
                'currency': 'INR',
                'status': 'captured',
                'amount': 100000,  # 1000 INR instead of 2000
            }
            mock_get_client.return_value = mock_inst

            res = self.client.post(
                '/api/verify-payment/',
                data=json.dumps({
                    'razorpay_order_id': 'order_mm_001',
                    'razorpay_payment_id': 'pay_mm',
                    'razorpay_signature': 'sig_mm',
                }),
                content_type='application/json',
            )
            self.assertEqual(res.status_code, 400)
            self.assertIn("reconciled", res.json()['error'])

    def test_verify_payment_not_captured(self):
        """Provider says payment is 'authorized' (not captured) → reject."""
        self._register_team(team_name='NotCaptured')
        team = Team.objects.get(team_name='NotCaptured')
        team.selection_status = Team.SelectionStatus.SELECTED
        team.email_verified = True
        team.save()

        Payment.objects.create(
            team=team,
            razorpay_order_id='order_nc_001',
            amount=Decimal('2000.00'),
            status=Payment.PaymentStatus.CREATED,
        )

        with patch('events.services.razorpay.get_razorpay_client') as mock_get_client:
            mock_inst = MagicMock()
            mock_inst.utility.verify_payment_signature.return_value = None
            mock_inst.payment.fetch.return_value = {
                'order_id': 'order_nc_001',
                'currency': 'INR',
                'status': 'authorized',  # NOT captured
                'amount': 200000,
            }
            mock_get_client.return_value = mock_inst

            res = self.client.post(
                '/api/verify-payment/',
                data=json.dumps({
                    'razorpay_order_id': 'order_nc_001',
                    'razorpay_payment_id': 'pay_nc',
                    'razorpay_signature': 'sig_nc',
                }),
                content_type='application/json',
            )
            self.assertEqual(res.status_code, 400)

    def test_verify_payment_invalid_signature(self):
        self._register_team(team_name='BadSig')
        team = Team.objects.get(team_name='BadSig')
        team.selection_status = Team.SelectionStatus.SELECTED
        team.email_verified = True
        team.save()

        Payment.objects.create(
            team=team,
            razorpay_order_id='order_bs_001',
            amount=Decimal('2000.00'),
            status=Payment.PaymentStatus.CREATED,
        )

        with patch('events.services.razorpay.get_razorpay_client') as mock_get_client:
            mock_inst = MagicMock()
            mock_inst.utility.verify_payment_signature.side_effect = SignatureVerificationError()
            mock_get_client.return_value = mock_inst

            res = self.client.post(
                '/api/verify-payment/',
                data=json.dumps({
                    'razorpay_order_id': 'order_bs_001',
                    'razorpay_payment_id': 'pay_bs',
                    'razorpay_signature': 'bad_sig',
                }),
                content_type='application/json',
            )
            self.assertEqual(res.status_code, 400)

        payment = Payment.objects.get(razorpay_order_id='order_bs_001')
        self.assertEqual(payment.status, Payment.PaymentStatus.FAILED)

    # --- Payment token expiry ----------------------------------------------

    def test_create_order_expired_payment_token(self):
        self._register_team(team_name='ExpiredPay')
        team = Team.objects.get(team_name='ExpiredPay')
        team.selection_status = Team.SelectionStatus.SELECTED
        team.email_verified = True
        team.payment_token_expires_at = timezone.now() - timedelta(days=1)
        team.save()

        res = self.client.post(
            '/api/create-order/',
            data=json.dumps({'payment_token': str(team.payment_token)}),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 410)
