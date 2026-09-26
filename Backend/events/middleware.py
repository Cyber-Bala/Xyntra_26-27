import logging
from django.http import JsonResponse
from django_ratelimit.exceptions import Ratelimited

logger = logging.getLogger(__name__)


class RatelimitMiddleware:
    """
    Middleware that intercepts django-ratelimit Ratelimited exceptions
    and returns a clean JSON 429 Too Many Requests response for API clients.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        if isinstance(exception, Ratelimited):
            client_ip = (
                request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip()
                or request.META.get('REMOTE_ADDR', 'unknown')
            )
            logger.warning(
                "Rate limit exceeded for IP %s on path %s [%s]",
                client_ip,
                request.path,
                request.method,
            )
            return JsonResponse(
                {
                    "error": "Too many requests. Please try again later.",
                    "status": 429,
                },
                status=429,
            )
        return None
