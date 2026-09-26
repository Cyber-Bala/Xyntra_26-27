import logging
from decimal import Decimal

from django.conf import settings
import razorpay
from razorpay.errors import SignatureVerificationError

logger = logging.getLogger(__name__)


def get_razorpay_client() -> razorpay.Client:
    """Returns an authenticated Razorpay Client instance."""
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET),
    )


def create_razorpay_order(team, amount_paise: int, pricing_tier: str) -> dict:
    """
    Creates a new order on Razorpay for the given team and amount.
    """
    client = get_razorpay_client()
    return client.order.create(
        data={
            "amount": amount_paise,
            "currency": "INR",
            "receipt": f"xyntra_team_{team.id}",
            "notes": {
                "team_id": str(team.id),
                "team_name": team.team_name,
                "pricing_tier": pricing_tier,
                "event": team.event.title,
            },
        },
        timeout=settings.RAZORPAY_TIMEOUT,
    )


def verify_razorpay_signature(order_id: str, payment_id: str, signature: str) -> None:
    """
    Verifies the HMAC-SHA256 signature returned by Razorpay Checkout.
    Raises SignatureVerificationError if signature is invalid.
    """
    client = get_razorpay_client()
    client.utility.verify_payment_signature({
        "razorpay_order_id": order_id,
        "razorpay_payment_id": payment_id,
        "razorpay_signature": signature,
    })


def fetch_razorpay_payment(payment_id: str) -> dict:
    """
    Fetches the authoritative payment object directly from Razorpay's API.
    """
    client = get_razorpay_client()
    return client.payment.fetch(
        payment_id,
        timeout=settings.RAZORPAY_TIMEOUT,
    )


def verify_razorpay_webhook_signature(body: str, signature: str, secret: str = None) -> None:
    """
    Verifies the HMAC-SHA256 signature on an incoming Razorpay webhook request.
    Raises SignatureVerificationError if signature is invalid.
    Raises ValueError if webhook secret is not configured.
    """
    if secret is None:
        secret = getattr(settings, 'RAZORPAY_WEBHOOK_SECRET', '')
    if not secret:
        raise ValueError("RAZORPAY_WEBHOOK_SECRET is not configured.")
    client = get_razorpay_client()
    client.utility.verify_webhook_signature(body, signature, secret)

