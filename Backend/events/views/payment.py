import json
import logging
from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from razorpay.errors import SignatureVerificationError

from ..models import Payment, Team
from ..services.razorpay import (
    create_razorpay_order,
    fetch_razorpay_payment,
    verify_razorpay_signature,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Stage 2 — Payment details (pre-flight)
# ---------------------------------------------------------------------------

@require_GET
def payment_details(request, payment_token):
    """
    Form 2 pre-flight: validates that the team is selected, checks IEEE
    eligibility, and returns the registration fee for checkout.
    Enforces payment_token expiry.
    """
    team = (
        Team.objects
        .select_related('event', 'payment')
        .prefetch_related('members')
        .filter(payment_token=payment_token)
        .first()
    )

    if not team:
        return JsonResponse({"error": "Invalid or expired payment token."}, status=404)

    # Token expiry check.
    if (
        team.payment_token_expires_at is not None
        and timezone.now() >= team.payment_token_expires_at
    ):
        return JsonResponse({"error": "Payment link has expired."}, status=410)

    if team.selection_status == Team.SelectionStatus.PENDING:
        return JsonResponse(
            {"error": "Your team is still under presentation review. Payment is not active."},
            status=403,
        )
    if team.selection_status == Team.SelectionStatus.REJECTED:
        return JsonResponse(
            {"error": "Your team was not selected for this event. Payment is closed."},
            status=403,
        )

    if team.is_paid:
        return JsonResponse({
            "message": "Payment has already been completed for this team.",
            "team_name": team.team_name,
            "is_paid": True,
            "payment_details": {
                "order_id": team.payment.razorpay_order_id,
                "payment_id": team.payment.razorpay_payment_id,
                "amount": str(team.payment.amount),
            } if hasattr(team, 'payment') and team.payment else None,
        })

    has_ieee = team.qualifies_for_ieee_discount
    price = team.event.ieee_price if has_ieee else team.event.regular_price
    pricing_tier = "ieee_discount" if has_ieee else "regular"
    amount_in_paise = int(price * Decimal('100'))

    return JsonResponse({
        "team_id": team.id,
        "team_name": team.team_name,
        "event_title": team.event.title,
        "leader_email": team.leader_email,
        "selection_status": team.selection_status,
        "email_verified": team.email_verified,
        "is_paid": False,
        "member_count": team.members.count(),
        "qualifies_for_ieee_discount": has_ieee,
        "pricing_tier": pricing_tier,
        "amount_inr": str(price),
        "amount_paise": amount_in_paise,
        "razorpay_key_id": settings.RAZORPAY_KEY_ID,
    })


# ---------------------------------------------------------------------------
# Stage 2 — Create Razorpay order (idempotent, serialized)
# ---------------------------------------------------------------------------

@csrf_exempt
@require_POST
def create_order(request):
    """
    Form 2 checkout: creates a Razorpay payment order for selected & verified teams.

    Security features:
    - select_for_update prevents concurrent duplicate orders.
    - Existing order is reused instead of overwritten.
    - Explicit Razorpay timeout handled via services layer.
    - Payment token expiry enforced.
    """
    try:
        data = json.loads(request.body.decode('utf-8')) if request.body else {}
    except (json.JSONDecodeError, UnicodeDecodeError):
        data = request.POST

    payment_token = data.get('payment_token', '')
    if isinstance(payment_token, str):
        payment_token = payment_token.strip()
    if not payment_token:
        return JsonResponse(
            {"error": "payment_token is required to initiate payment."},
            status=400,
        )

    with transaction.atomic():
        team = (
            Team.objects
            .select_for_update()
            .select_related('event')
            .filter(payment_token=payment_token)
            .first()
        )

        if not team:
            return JsonResponse({"error": "Invalid or expired payment token."}, status=404)

        # Token expiry.
        if (
            team.payment_token_expires_at is not None
            and timezone.now() >= team.payment_token_expires_at
        ):
            return JsonResponse({"error": "Payment link has expired."}, status=410)

        if team.selection_status != Team.SelectionStatus.SELECTED:
            return JsonResponse(
                {"error": "Payment is only permitted for selected teams."},
                status=403,
            )

        if not team.email_verified:
            return JsonResponse(
                {"error": "Leader email has not been verified. Please verify your email first."},
                status=403,
            )

        if team.is_paid:
            return JsonResponse(
                {"error": "This team registration has already been paid."},
                status=409,
            )

        # If an order already exists for this team, return it (idempotent).
        existing_payment = (
            Payment.objects
            .select_for_update()
            .filter(team=team)
            .first()
        )

        if existing_payment:
            return JsonResponse({
                "order_id": existing_payment.razorpay_order_id,
                "amount_inr": str(existing_payment.amount),
                "amount_paise": int(existing_payment.amount * Decimal('100')),
                "currency": "INR",
                "key_id": settings.RAZORPAY_KEY_ID,
                "team_name": team.team_name,
            })

        # Compute price.
        has_ieee = team.qualifies_for_ieee_discount
        price = team.event.ieee_price if has_ieee else team.event.regular_price
        pricing_tier = "ieee_discount" if has_ieee else "regular"

        if price <= Decimal('0.00'):
            return JsonResponse({"error": "Invalid event pricing."}, status=500)

        amount_in_paise = int(price * Decimal('100'))

        # Create Razorpay order via services layer.
        try:
            razorpay_order = create_razorpay_order(
                team=team,
                amount_paise=amount_in_paise,
                pricing_tier=pricing_tier,
            )
            order_id = razorpay_order['id']
        except Exception:
            logger.exception("Razorpay order creation failed for team %s", team.id)
            return JsonResponse(
                {"error": "Failed to create payment order. Please try again later."},
                status=502,
            )

        Payment.objects.create(
            team=team,
            razorpay_order_id=order_id,
            amount=price,
            status=Payment.PaymentStatus.CREATED,
        )

    return JsonResponse({
        "order_id": order_id,
        "amount_inr": str(price),
        "amount_paise": amount_in_paise,
        "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID,
        "team_name": team.team_name,
        "pricing_tier": pricing_tier,
        "has_ieee_discount": has_ieee,
    })


# ---------------------------------------------------------------------------
# Stage 2 — Payment verification (with Razorpay reconciliation)
# ---------------------------------------------------------------------------

@csrf_exempt
@require_POST
def verify_payment(request):
    """
    Form 2 payment verification: verifies Razorpay HMAC-SHA256 signature
    and reconciles with the payment provider before marking the registration as paid.

    Security features:
    - Fetches authoritative payment from Razorpay to verify captured status,
      amount, currency, and order association.
    - Uses select_for_update for idempotent payment confirmation.
    - Only marks is_paid for SELECTED teams.
    """
    try:
        data = json.loads(request.body.decode('utf-8')) if request.body else {}
    except (json.JSONDecodeError, UnicodeDecodeError):
        data = request.POST

    order_id = data.get('razorpay_order_id', '').strip() if isinstance(data.get('razorpay_order_id'), str) else ''
    payment_id = data.get('razorpay_payment_id', '').strip() if isinstance(data.get('razorpay_payment_id'), str) else ''
    signature = data.get('razorpay_signature', '').strip() if isinstance(data.get('razorpay_signature'), str) else ''

    if not order_id or not payment_id or not signature:
        return JsonResponse(
            {"error": "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required."},
            status=400,
        )

    # --- Signature verification + provider reconciliation ------------------
    try:
        verify_razorpay_signature(order_id, payment_id, signature)
        provider_payment = fetch_razorpay_payment(payment_id)

    except SignatureVerificationError:
        # Mark payment as failed (outside the reconciliation block).
        Payment.objects.filter(razorpay_order_id=order_id).update(
            status=Payment.PaymentStatus.FAILED,
            updated_at=timezone.now(),
        )
        return JsonResponse({"error": "Invalid payment signature."}, status=400)

    except Exception:
        logger.exception("Razorpay verification failed for order %s", order_id)
        return JsonResponse(
            {"error": "Payment verification temporarily failed. Please try again."},
            status=502,
        )

    # --- Provider reconciliation -------------------------------------------
    payment_obj = (
        Payment.objects
        .select_related('team')
        .filter(razorpay_order_id=order_id)
        .first()
    )
    if not payment_obj:
        return JsonResponse({"error": "No matching payment order found."}, status=404)

    expected_amount_paise = int(payment_obj.amount * Decimal('100'))

    if (
        provider_payment.get('order_id') != order_id
        or provider_payment.get('currency') != 'INR'
        or provider_payment.get('status') != 'captured'
        or int(provider_payment.get('amount', -1)) != expected_amount_paise
    ):
        logger.warning(
            "Payment reconciliation failed for order=%s payment=%s: "
            "provider_order=%s currency=%s status=%s amount=%s (expected %s)",
            order_id,
            payment_id,
            provider_payment.get('order_id'),
            provider_payment.get('currency'),
            provider_payment.get('status'),
            provider_payment.get('amount'),
            expected_amount_paise,
        )
        return JsonResponse(
            {"error": "Payment could not be reconciled with the registration amount."},
            status=400,
        )

    # --- Atomic state transition -------------------------------------------
    with transaction.atomic():
        payment_obj = Payment.objects.select_for_update().get(pk=payment_obj.pk)

        if payment_obj.status == Payment.PaymentStatus.PAID:
            return JsonResponse({
                "message": "Payment has already been verified and confirmed.",
                "team_name": payment_obj.team.team_name,
                "is_paid": True,
            })

        payment_obj.razorpay_payment_id = payment_id
        payment_obj.razorpay_signature = signature
        payment_obj.status = Payment.PaymentStatus.PAID
        payment_obj.save(update_fields=[
            'razorpay_payment_id',
            'razorpay_signature',
            'status',
            'updated_at',
        ])

        # Only mark teams that are actually SELECTED.
        Team.objects.filter(
            pk=payment_obj.team_id,
            is_paid=False,
            selection_status=Team.SelectionStatus.SELECTED,
        ).update(
            is_paid=True,
            updated_at=timezone.now(),
        )

    payment_obj.team.refresh_from_db()

    return JsonResponse({
        "message": "Payment verified and registration confirmed successfully!",
        "team_name": payment_obj.team.team_name,
        "leader_email": payment_obj.team.leader_email,
        "is_paid": payment_obj.team.is_paid,
        "amount_paid": str(payment_obj.amount),
        "payment_id": payment_id,
    })
