import logging

from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse

logger = logging.getLogger(__name__)


def send_registration_confirmation_email(team, request=None):
    """
    Sends confirmation and email verification link to the team leader.
    Also includes the opaque status_token for registration-status lookups.
    """
    token_str = str(team.email_token)
    status_token_str = str(team.status_token)
    frontend_url = getattr(settings, 'FRONTEND_URL', '').rstrip('/')

    if frontend_url:
        verify_url = f"{frontend_url}/verify-email/{token_str}/"
        status_url = f"{frontend_url}/registration-status?status_token={status_token_str}"
    elif request:
        verify_url = request.build_absolute_uri(
            reverse('verify-email')
        ) + f"?token={token_str}"
        status_url = request.build_absolute_uri(
            reverse('registration-status')
        ) + f"?status_token={status_token_str}"
    else:
        verify_url = f"/api/verify-email/?token={token_str}"
        status_url = f"/api/registration-status/?status_token={status_token_str}"

    subject = f"Registration Received: {team.team_name} — {team.event.title}"
    message = f"""Hello {team.team_name} Leader,

Thank you for registering your team for {team.event.title}!

STAGE 1: EMAIL VERIFICATION
Please verify your email address by visiting the link below and confirming:
{verify_url}

Registration Summary:
- Team Name: {team.team_name}
- Total Members: {team.member_count}
- Presentation (PPT): Uploaded successfully (Under Review)
- Status: PENDING PPT EVALUATION

CHECK YOUR STATUS:
You can check your registration status at any time using this link:
{status_url}
Please save this link — it is your unique status-check token.

WHAT HAPPENS NEXT?
Our evaluation committee is reviewing all submitted presentation decks.
If your team is selected to participate in the hackathon, you will receive
a separate email with a private link (Form 2) to complete payment.

Best regards,
The {team.event.title} Organizing Committee
"""

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@xyntra.com'),
            recipient_list=[team.leader_email],
            fail_silently=False,
        )
        return True
    except Exception as exc:
        logger.error("Failed to send confirmation email to %s: %s", team.leader_email, exc)
        return False


def send_selection_payment_email(team, request=None):
    """
    Sends private Form 2 payment link to selected teams.
    Also includes the status_token for status lookups.
    """
    payment_token_str = str(team.payment_token)
    status_token_str = str(team.status_token)
    frontend_url = getattr(settings, 'FRONTEND_URL', '').rstrip('/')

    if frontend_url:
        payment_url = f"{frontend_url}/payment/{payment_token_str}/"
        status_url = f"{frontend_url}/registration-status?status_token={status_token_str}"
    elif request:
        payment_url = request.build_absolute_uri(
            reverse('payment-details', args=[payment_token_str])
        )
        status_url = request.build_absolute_uri(
            reverse('registration-status')
        ) + f"?status_token={status_token_str}"
    else:
        payment_url = f"/api/payment-details/{payment_token_str}/"
        status_url = f"/api/registration-status/?status_token={status_token_str}"

    has_ieee = team.qualifies_for_ieee_discount
    amount = team.event.ieee_price if has_ieee else team.event.regular_price
    tier_label = (
        "IEEE Member Discount (100% Team Verified)"
        if has_ieee
        else "Standard Registration"
    )

    subject = f"Congratulations! {team.team_name} Selected for {team.event.title} — Payment Link"
    message = f"""Dear {team.team_name} Leader and Members,

Congratulations! We are pleased to inform you that your presentation has been
evaluated and your team has been SELECTED for {team.event.title}!

STAGE 2: COMPLETE YOUR PAYMENT (FORM 2)
To secure your slot, please complete your team registration fee payment
using your private payment link:

{payment_url}

Fee Breakdown:
- Pricing Tier: {tier_label}
- Total Team Amount: ₹{amount}

CHECK YOUR STATUS:
{status_url}

Important:
- Only selected teams have access to this payment gateway.
- Please ensure you complete the payment prior to the event kickoff.

We look forward to seeing your team in action!

Best regards,
The {team.event.title} Organizing Committee
"""

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@xyntra.com'),
            recipient_list=[team.leader_email],
            fail_silently=False,
        )
        return True
    except Exception as exc:
        logger.error("Failed to send selection email to %s: %s", team.leader_email, exc)
        return False
