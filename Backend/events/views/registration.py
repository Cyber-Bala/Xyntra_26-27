import json
import logging

from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from ..models import (
    Event,
    Team,
    TeamMember,
    validate_id_card_file,
    validate_ppt_file,
    validate_team_member_count,
)
from ..services.emails import send_registration_confirmation_email
from .validators import (
    MAX_MEMBERS_JSON_BYTES,
    _reject_oversized_request,
    _require_bool,
    _require_string,
)

logger = logging.getLogger(__name__)


@csrf_exempt
@require_POST
def register(request):
    """
    Form 1 initial registration: validates team info, PPT upload, member roster,
    and optional IEEE ID card files. Sets team status to pending.

    Security features:
    - Request-size guard (40 MB)
    - Members-JSON size guard (64 KB)
    - Strict type validation (no bool coercion from strings)
    - TOCTOU race eliminated: uniqueness checks inside select_for_update
    - Orphaned-file cleanup on transaction rollback
    """

    # --- Request-size guard ------------------------------------------------
    oversized = _reject_oversized_request(request)
    if oversized:
        return oversized

    # --- Basic fields ------------------------------------------------------
    team_name = request.POST.get('team_name', '').strip()
    leader_email = request.POST.get('leader_email', '').strip().lower()
    leader_phone = request.POST.get('leader_phone', '').strip()

    if not team_name:
        return JsonResponse({"error": "Team name is required."}, status=400)
    if len(team_name) > 150:
        return JsonResponse({"error": "Team name must not exceed 150 characters."}, status=400)
    if not leader_email:
        return JsonResponse({"error": "Leader email is required."}, status=400)
    if not leader_phone:
        return JsonResponse({"error": "Leader phone is required."}, status=400)

    ppt_file = request.FILES.get('ppt_file')
    if not ppt_file:
        return JsonResponse({"error": "Presentation file (ppt_file) is required."}, status=400)

    try:
        validate_ppt_file(ppt_file)
    except ValidationError as err:
        return JsonResponse({"error": err.message}, status=400)

    # --- Members JSON (size-limited) ---------------------------------------
    members_raw = request.POST.get('members', '')
    if not members_raw:
        return JsonResponse({"error": "Members list (JSON string) is required."}, status=400)

    if len(members_raw.encode('utf-8')) > MAX_MEMBERS_JSON_BYTES:
        return JsonResponse({"error": "Members payload is too large."}, status=413)

    try:
        members_data = json.loads(members_raw)
    except (json.JSONDecodeError, TypeError):
        return JsonResponse({"error": "Invalid members JSON format."}, status=400)

    if not isinstance(members_data, list):
        return JsonResponse({"error": "Members data must be a list of member objects."}, status=400)

    member_count = len(members_data)
    if member_count < 4 or member_count > 6:
        return JsonResponse(
            {"error": f"A team must have between 4 and 6 members. Received: {member_count}."},
            status=400,
        )

    # --- Per-member validation (strict types) ------------------------------
    member_emails = []
    sanitized_members = []
    for idx, member in enumerate(members_data, start=1):
        if not isinstance(member, dict):
            return JsonResponse({"error": f"Member #{idx} must be an object."}, status=400)

        try:
            full_name = _require_string(member.get('full_name'), 'full_name', 150)
            email = _require_string(member.get('email'), 'email', 254).lower()
            phone = _require_string(member.get('phone'), 'phone', 20)
            college = _require_string(member.get('college'), 'college', 255)
            ieee_member = _require_bool(member.get('ieee_member', False), 'ieee_member')
        except ValidationError as err:
            return JsonResponse(
                {"error": f"Member #{idx}: {err.message}"},
                status=400,
            )

        # IEEE membership ID — optional string.
        ieee_id = member.get('ieee_membership_id', '')
        if not isinstance(ieee_id, str):
            return JsonResponse(
                {"error": f"Member #{idx}: ieee_membership_id must be a string."},
                status=400,
            )
        ieee_id = ieee_id.strip()
        if len(ieee_id) > 100:
            return JsonResponse(
                {"error": f"Member #{idx}: IEEE membership ID is too long."},
                status=400,
            )

        if email in member_emails:
            return JsonResponse(
                {"error": f"Duplicate email '{email}' detected within the submitted team."},
                status=400,
            )

        card_file = (
            request.FILES.get(f'ieee_card_{idx}')
            or request.FILES.get(f'ieee_card_{email}')
            or request.FILES.get(f'member_{idx}_card')
        )

        if ieee_member:
            if not ieee_id:
                return JsonResponse(
                    {"error": f"IEEE Membership ID is required for {full_name} (Member #{idx})."},
                    status=400,
                )
            if not card_file:
                return JsonResponse(
                    {"error": f"IEEE ID card file upload is required for {full_name} (Member #{idx})."},
                    status=400,
                )
            try:
                validate_id_card_file(card_file)
            except ValidationError as err:
                return JsonResponse(
                    {"error": f"Invalid ID card for {full_name}: {err.message}"},
                    status=400,
                )

        member_emails.append(email)
        sanitized_members.append({
            'full_name': full_name,
            'email': email,
            'phone': phone,
            'college': college,
            'ieee_member': ieee_member,
            'ieee_membership_id': ieee_id,
            'card_file': card_file,
        })

    if leader_email not in member_emails:
        return JsonResponse(
            {"error": "Leader email must be one of the registered team members."},
            status=400,
        )

    # --- Atomic registration with TOCTOU protection ------------------------
    created_files: list[str] = []

    try:
        with transaction.atomic():
            # Lock the event row to serialize registration decisions.
            event = (
                Event.objects
                .select_for_update()
                .filter(is_active=True)
                .first()
            )

            if not event:
                return JsonResponse(
                    {"error": "No active event available for registration."},
                    status=404,
                )

            if not event.is_registration_open:
                return JsonResponse(
                    {"error": "Registration is closed for this event."},
                    status=400,
                )

            # Check team-name uniqueness inside the lock.
            if Team.objects.filter(event=event, team_name__iexact=team_name).exists():
                return JsonResponse(
                    {"error": "A team with this name is already registered for this event."},
                    status=409,
                )

            # Check member-email uniqueness inside the lock.
            conflicting_email = (
                TeamMember.objects
                .filter(team__event=event, email__in=member_emails)
                .values_list('email', flat=True)
                .first()
            )
            if conflicting_email:
                return JsonResponse(
                    {"error": "One or more members are already registered for this event."},
                    status=409,
                )

            team = Team.objects.create(
                event=event,
                team_name=team_name,
                leader_email=leader_email,
                leader_phone=leader_phone,
                ppt_file=ppt_file,
                selection_status=Team.SelectionStatus.PENDING,
                is_paid=False,
            )
            if team.ppt_file and team.ppt_file.name:
                created_files.append(team.ppt_file.name)

            for m in sanitized_members:
                obj = TeamMember.objects.create(
                    team=team,
                    full_name=m['full_name'],
                    email=m['email'],
                    phone=m['phone'],
                    college=m['college'],
                    ieee_member=m['ieee_member'],
                    ieee_membership_id=m['ieee_membership_id'],
                    ieee_id_card=m['card_file'],
                )
                if obj.ieee_id_card and obj.ieee_id_card.name:
                    created_files.append(obj.ieee_id_card.name)

            # Model-level member-count validation.
            validate_team_member_count(team)

        # Send confirmation email *after* commit (not inside the transaction).
        email_sent = send_registration_confirmation_email(team, request=request)

        return JsonResponse({
            "message": (
                "Team registration and presentation deck submitted successfully. "
                "Your submission is now under review by the evaluation committee."
            ),
            "team_id": team.id,
            "team_name": team.team_name,
            "member_count": len(sanitized_members),
            "selection_status": team.selection_status,
            "email_verified": team.email_verified,
            "status_token": str(team.status_token),
            "confirmation_email_sent": email_sent,
        }, status=201)

    except ValidationError as err:
        return JsonResponse({"error": err.message}, status=400)

    except Exception:
        logger.exception("Registration failed for team '%s'", team_name)

        # Clean up orphaned files when the transaction has rolled back.
        for filename in created_files:
            try:
                default_storage.delete(filename)
            except Exception:
                logger.exception("Failed to clean up uploaded file %s", filename)

        return JsonResponse(
            {"error": "An internal error occurred during registration. Please try again."},
            status=500,
        )
