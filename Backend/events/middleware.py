import logging
from django.http import JsonResponse
from django_ratelimit.exceptions import Ratelimited

logger = logging.getLogger(__name__)


def get_client_ip(request):
    """
    Extract the client's real IP address, accounting for reverse proxies (Render, etc.).
    Falls back to REMOTE_ADDR or '127.0.0.1'.
    """
    xff = request.META.get('HTTP_X_FORWARDED_FOR', '')
    if xff:
        ip = xff.split(',')[0].strip()
        if ip.startswith('[') and ']' in ip:
            ip = ip[1:ip.index(']')]
        elif ':' in ip and '.' in ip:
            ip = ip.split(':')[0]
        if ip:
            return ip

    remote_addr = request.META.get('REMOTE_ADDR', '')
    if remote_addr:
        ip = remote_addr.strip()
        if ip.startswith('[') and ']' in ip:
            ip = ip[1:ip.index(']')]
        elif ':' in ip and '.' in ip:
            ip = ip.split(':')[0]
        if ip:
            return ip

    return '127.0.0.1'


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
            client_ip = get_client_ip(request)
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
