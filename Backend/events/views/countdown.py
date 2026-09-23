from django.http import JsonResponse
from django.views.decorators.http import require_GET

from ..models import Event


@require_GET
def countdown(request):
    """
    Returns active event metadata, registration status, and countdown breakdown.
    """
    event = Event.objects.filter(is_active=True).first()
    if not event:
        return JsonResponse({"error": "No active event found."}, status=404)

    total_seconds = event.seconds_remaining
    days = total_seconds // 86400
    hours = (total_seconds % 86400) // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60

    return JsonResponse({
        "event_id": event.id,
        "title": event.title,
        "description": event.description,
        "event_date": event.event_date.isoformat(),
        "registration_deadline": event.registration_deadline.isoformat(),
        "venue": event.venue,
        "regular_price": str(event.regular_price),
        "ieee_price": str(event.ieee_price),
        "is_registration_open": event.is_registration_open,
        "seconds_remaining": total_seconds,
        "countdown": {
            "total_seconds": total_seconds,
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds,
        },
    })
