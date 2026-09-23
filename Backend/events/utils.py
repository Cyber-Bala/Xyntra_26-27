"""
Backward-compatibility bridge.
Business logic and transactional notification services have been moved to `events.services`.
"""

from .services.emails import (
    send_registration_confirmation_email,
    send_selection_payment_email,
)

__all__ = [
    'send_registration_confirmation_email',
    'send_selection_payment_email',
]
