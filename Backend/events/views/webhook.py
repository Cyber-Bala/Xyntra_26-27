import json
import logging
from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from razorpay.errors import SignatureVerificationError

from ..models import Payment, Team
from ..services.razorpay import verify_razorpay_webhook_signature

logger = logging.getLogger(__name__)


@csrf_exempt
@require_POST
def razorpay_webhook(request):
    """
    Server-to-server webhook endpoint called by Razorpay when payment
    events occur (e.g., payment.captured, order.paid, payment.failed).

    Provides authoritative payment confirmation even if the user's browser
    crashes or disconnects before the client callback fires.

    Security features:
    - Cryptographic HMAC-SHA256 signature verification via X-Razorpay-Signature.
    - Amount and currency reconciliation before marking payment as paid.
    - Concurrency-safe atomic transaction with select_for_update.
    - Strictly idempotent: duplicate webhook deliveries return 200 without side effects.
    - Enforces that only SELECTED teams have is_paid marked True.
    """
    signature = (
        request.headers.get('X-Razorpay-Signature')
        or request.META.get('HTTP_X_RAZORPAY_SIGNATURE', '')
    )
    if isinstance(signature, str):
        signature = signature.strip()

    if not signature:
        return JsonResponse(
            {"error": "Missing X-Razorpay-Signature header."},
            status=400,
        )

    # Decode raw body for signature verification
    try:
        raw_body = request.body.decode('utf-8')
    except UnicodeDecodeError:
        return JsonResponse({"error": "Invalid payload encoding."}, status=400)

    try:
        verify_razorpay_webhook_signature(raw_body, signature)
    except ValueError as err:
        logger.error("Razorpay webhook configuration error: %s", err)
        return JsonResponse(
            {"error": "Webhook secret is not configured on the server."},
            status=503,
        )
    except SignatureVerificationError:
        logger.warning("Invalid Razorpay webhook signature received.")
        return JsonResponse(
            {"error": "Invalid webhook signature."},
            status=400,
        )
    except Exception:
        logger.exception("Unexpected error verifying Razorpay webhook signature.")
        return JsonResponse(
            {"error": "Failed to verify webhook signature."},
            status=500,
        )

    try:
        event_data = json.loads(raw_body)
    except (json.JSONDecodeError, TypeError):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    event_type = event_data.get('event', '')

    # --- Handle successful payment events -----------------------------------
    if event_type in ('payment.captured', 'order.paid'):
        payload = event_data.get('payload', {})
        payment_entity = payload.get('payment', {}).get('entity', {})
        order_entity = payload.get('order', {}).get('entity', {})

        order_id = payment_entity.get('order_id') or order_entity.get('id')
        payment_id = payment_entity.get('id')
        amount_paise = (
            payment_entity.get('amount')
            or order_entity.get('amount_paid')
            or order_entity.get('amount')
        )
        currency = payment_entity.get('currency') or order_entity.get('currency')

        if not order_id:
            logger.warning("Razorpay webhook %s missing order_id.", event_type)
            return JsonResponse({"error": "No order_id found in event payload."}, status=400)

        with transaction.atomic():
            payment_obj = (
                Payment.objects
                .select_for_update()
                .select_related('team')
                .filter(razorpay_order_id=order_id)
                .first()
            )

            if not payment_obj:
                logger.warning("Webhook received for unknown Razorpay order: %s", order_id)
                return JsonResponse(
                    {"status": "ignored", "reason": f"Order {order_id} not found."},
                    status=200,
                )

            # Idempotency check: already paid
            if payment_obj.status == Payment.PaymentStatus.PAID:
                return JsonResponse(
                    {
                        "status": "already_processed",
                        "order_id": order_id,
                        "team_name": payment_obj.team.team_name,
                        "is_paid": True,
                    },
                    status=200,
                )

            # Amount reconciliation
            expected_paise = int(payment_obj.amount * Decimal('100'))
            if amount_paise is not None and int(amount_paise) != expected_paise:
                logger.warning(
                    "Webhook payment amount mismatch for order %s: received %s, expected %s",
                    order_id,
                    amount_paise,
                    expected_paise,
                )
                return JsonResponse(
                    {"error": "Payment amount could not be reconciled with the order."},
                    status=400,
                )

            if currency and currency != 'INR':
                logger.warning("Webhook currency mismatch for order %s: %s", order_id, currency)
                return JsonResponse({"error": "Currency mismatch."}, status=400)

            # Transition Payment status
            payment_obj.status = Payment.PaymentStatus.PAID
            if payment_id:
                payment_obj.razorpay_payment_id = payment_id
            payment_obj.save(update_fields=['status', 'razorpay_payment_id', 'updated_at'])

            # Transition Team to is_paid=True (only if SELECTED)
            Team.objects.filter(
                pk=payment_obj.team_id,
                is_paid=False,
                selection_status=Team.SelectionStatus.SELECTED,
            ).update(
                is_paid=True,
                updated_at=timezone.now(),
            )

        logger.info(
            "Webhook successfully confirmed payment for order %s (Team: %s)",
            order_id,
            payment_obj.team.team_name,
        )
        return JsonResponse(
            {
                "status": "success",
                "event": event_type,
                "order_id": order_id,
                "team_name": payment_obj.team.team_name,
                "is_paid": True,
            },
            status=200,
        )

    # --- Handle payment failure event ---------------------------------------
    elif event_type == 'payment.failed':
        payment_entity = event_data.get('payload', {}).get('payment', {}).get('entity', {})
        order_id = payment_entity.get('order_id')
        if order_id:
            Payment.objects.filter(
                razorpay_order_id=order_id,
                status=Payment.PaymentStatus.CREATED,
            ).update(
                status=Payment.PaymentStatus.FAILED,
                updated_at=timezone.now(),
            )
            logger.info("Webhook marked order %s as FAILED based on payment.failed event.", order_id)

        return JsonResponse({"status": "recorded_failure", "event": event_type}, status=200)

    # --- Other Razorpay events ignored with 200 OK -------------------------
    logger.debug("Razorpay webhook event '%s' ignored.", event_type)
    return JsonResponse(
        {"status": "ignored", "event": event_type},
        status=200,
    )
