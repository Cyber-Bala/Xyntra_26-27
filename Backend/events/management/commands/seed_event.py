from datetime import timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from events.models import Event


class Command(BaseCommand):
    help = "Seeds or updates the sample active hackathon event (XYNTRA 2026) for testing"

    def handle(self, *args, **options):
        now = timezone.now()
        event, created = Event.objects.update_or_create(
            title="XYNTRA 2026",
            defaults={
                "description": "National Inter-College Hackathon & Tech Symposium",
                "event_date": now + timedelta(days=30),
                "registration_deadline": now + timedelta(days=15),
                "venue": "Campus Main Auditorium & Innovation Hub",
                "regular_price": Decimal("2000.00"),
                "ieee_price": Decimal("1500.00"),
                "is_active": True,
            },
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f"Successfully seeded event: '{event.title}'"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Updated existing event: '{event.title}'"))
