import json
import uuid as uuid_mod

from django.db import transaction
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django_ratelimit.decorators import ratelimit

from ..models import Team


@csrf_exempt
@require_POST
@ratelimit(key='ip', rate='10/m', method='POST', block=True)
def verify_email(request):
    """
    Verifies the team leader's email address using their unique token.

    Security features:
    - Rate-limited to 10 requests/minute per IP
    - Enforces POST to prevent scanners/prefetchers from triggering verification.
    - Token expiry is strictly checked.
    - Uses select_for_update for idempotent state transition.
    """
    try:
        data = json.loads(request.body.decode('utf-8')) if request.body else {}
    except (json.JSONDecodeError, UnicodeDecodeError):
        data = request.POST

    raw_token = data.get('token', '').strip() if isinstance(data.get('token'), str) else ''
    if not raw_token:
        return JsonResponse({"error": "Verification token is required."}, status=400)

    try:
        token_uuid = uuid_mod.UUID(raw_token)
    except (ValueError, AttributeError, TypeError):
        return JsonResponse({"error": "Invalid verification token."}, status=400)

    with transaction.atomic():
        team = (
            Team.objects
            .select_for_update()
            .filter(email_token=token_uuid)
            .first()
        )

        if team is None:
            return JsonResponse({"error": "Invalid verification token."}, status=404)

        # Enforce token expiry.
        if (
            team.email_token_expires_at is not None
            and timezone.now() >= team.email_token_expires_at
        ):
            return JsonResponse(
                {"error": "Verification link has expired."},
                status=410,
            )

        if team.email_verified:
            return JsonResponse({
                "message": "Email is already verified.",
                "team_name": team.team_name,
                "email_verified": True,
            })

        team.email_verified = True
        team.save(update_fields=['email_verified', 'updated_at'])

    return JsonResponse({
        "message": "Email verified successfully! Your application is currently under PPT evaluation.",
        "team_name": team.team_name,
        "email_verified": True,
    })
