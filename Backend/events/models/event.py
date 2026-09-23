from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import UniqueConstraint
from django.utils import timezone


class Event(models.Model):
    title = models.CharField(
        max_length=200,
        help_text="Event title (e.g., XYNTRA 2026)",
    )
    description = models.TextField(blank=True, help_text="Detailed event description")
    event_date = models.DateTimeField(
        help_text="Target datetime for countdown and event start",
    )
    registration_deadline = models.DateTimeField(
        help_text="Automatic registration closing date & time",
    )
    venue = models.CharField(max_length=255, help_text="Event venue or virtual platform")
    regular_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.01'),
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Standard team registration price in INR",
    )
    ieee_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.01'),
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Discounted team price for 100%% IEEE teams in INR",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Manual master switch to open or close registrations anytime",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'events'
        ordering = ['-event_date']
        verbose_name = 'Event'
        verbose_name_plural = 'Events'
        constraints = [
            # Guarantee at most one active event at the database level.
            UniqueConstraint(
                fields=["is_active"],
                condition=models.Q(is_active=True),
                name="only_one_active_event",
            ),
        ]

    def __str__(self):
        return self.title

    def clean(self):
        super().clean()
        if (
            self.ieee_price is not None
            and self.regular_price is not None
            and self.ieee_price > self.regular_price
        ):
            raise ValidationError(
                "IEEE price must not exceed the regular price."
            )

    @property
    def is_registration_open(self) -> bool:
        return self.is_active and timezone.now() < self.registration_deadline

    @property
    def seconds_remaining(self) -> int:
        diff = (self.event_date - timezone.now()).total_seconds()
        return max(0, int(diff))
