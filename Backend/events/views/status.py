import uuid as uuid_mod

from django.http import JsonResponse
from django.views.decorators.http import require_GET

from ..models import Team


@require_GET
def registration_status(request, status_token=None):
    """
    Returns team registration state using an opaque status token.

    Security features:
    - Replaced email-based lookup (IDOR/BOLA) with opaque UUID status_token.
    - Omitted member PII (emails, colleges, IEEE cards) from response.
    - Uniform 404 message to prevent account enumeration.
    """
    if status_token is not None:
        raw_token = str(status_token).strip()
    else:
        raw_token = request.GET.get('status_token', '').strip()

    try:
        token = uuid_mod.UUID(raw_token)
    except (ValueError, AttributeError, TypeError):
        return JsonResponse({"error": "Invalid status token."}, status=400)

    team = (
        Team.objects
        .select_related('event', 'payment')
        .prefetch_related('members')
        .filter(status_token=token)
        .first()
    )

    if team is None:
        # Do not reveal whether a team or email exists.
        return JsonResponse({"error": "Registration not found."}, status=404)

    return JsonResponse({
        "team_name": team.team_name,
        "event_title": team.event.title,
        "leader_email": team.leader_email,
        "selection_status": team.selection_status,
        "email_verified": team.email_verified,
        "is_paid": team.is_paid,
        "member_count": team.members.count(),
    })
