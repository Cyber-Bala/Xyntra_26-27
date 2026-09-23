from django.core.exceptions import ValidationError
from django.http import JsonResponse

# ---------------------------------------------------------------------------
# Request Bounds
# ---------------------------------------------------------------------------

MAX_REQUEST_BYTES = 40 * 1024 * 1024  # 40 MB hard cap
MAX_MEMBERS_JSON_BYTES = 64 * 1024    # 64 KB for the members JSON blob


def _reject_oversized_request(request):
    """Return a 413 JsonResponse if Content-Length exceeds the cap, else None."""
    content_length = request.META.get("CONTENT_LENGTH")
    try:
        size = int(content_length) if content_length else 0
    except (TypeError, ValueError):
        return JsonResponse({"error": "Invalid request size."}, status=400)
    if size > MAX_REQUEST_BYTES:
        return JsonResponse({"error": "Request is too large."}, status=413)
    return None


def _require_string(value, field: str, max_length: int) -> str:
    """Validate that *value* is a non-empty string within *max_length*."""
    if not isinstance(value, str):
        raise ValidationError(f"{field} must be a string.")
    value = value.strip()
    if not value:
        raise ValidationError(f"{field} is required.")
    if len(value) > max_length:
        raise ValidationError(f"{field} must not exceed {max_length} characters.")
    return value


def _require_bool(value, field: str) -> bool:
    """Validate that *value* is a real JSON boolean."""
    if not isinstance(value, bool):
        raise ValidationError(f"{field} must be a boolean.")
    return value
