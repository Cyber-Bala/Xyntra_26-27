import uuid

from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.functions import Lower

from .event import Event
from .validators import (
    _default_email_token_expiry,
    ieee_card_upload_path,
    ppt_upload_path,
    validate_id_card_file,
    validate_ppt_file,
)


class Team(models.Model):
    class SelectionStatus(models.TextChoices):
        PENDING = 'pending', 'Pending Review'
        SELECTED = 'selected', 'Selected for Final Round'
        REJECTED = 'rejected', 'Not Selected'

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='teams',
        help_text="Event this team is registered for",
    )
    team_name = models.CharField(max_length=150)
    leader_email = models.EmailField()
    leader_phone = models.CharField(max_length=20)

    # --- Tokens -----------------------------------------------------------
    email_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email_token_expires_at = models.DateTimeField(
        default=_default_email_token_expiry,
        help_text="Email verification token expiry (default 24 h after creation).",
    )

    payment_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    payment_token_expires_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Payment token expiry (set when team is selected).",
    )

    # Opaque token for public registration-status lookups (not email-based).
    status_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    # --- State -------------------------------------------------------------
    email_verified = models.BooleanField(default=False)
    selection_status = models.CharField(
        max_length=20,
        choices=SelectionStatus.choices,
        default=SelectionStatus.PENDING,
    )
    is_paid = models.BooleanField(default=False)

    ppt_file = models.FileField(
        upload_to=ppt_upload_path,
        validators=[validate_ppt_file],
        help_text="Presentation deck (.ppt, .pptx, or .pdf, max 10 MB)",
    )

    registered_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'events'
        unique_together = ('event', 'team_name')
        constraints = [
            UniqueConstraint(
                Lower('team_name'),
                'event',
                name='unique_team_name_per_event_ci',
            ),
        ]
        ordering = ['-registered_at']
        verbose_name = 'Team'
        verbose_name_plural = 'Teams'

    def __str__(self):
        return f"{self.team_name} [{self.selection_status.upper()}] ({self.event.title})"

    @property
    def qualifies_for_ieee_discount(self) -> bool:
        """
        Returns True only if every member has admin-verified IEEE credentials.
        """
        members = self.members.all()
        total_count = len(members)
        if total_count == 0:
            return False

        ieee_verified_count = sum(
            1
            for m in members
            if (
                m.ieee_verified
                and m.ieee_membership_id
                and m.ieee_id_card
            )
        )
        return total_count == ieee_verified_count

    @property
    def member_count(self) -> int:
        return self.members.count()


class TeamMember(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    college = models.CharField(max_length=255)

    # Client-submitted IEEE claim (self-attested).
    ieee_member = models.BooleanField(default=False)
    ieee_membership_id = models.CharField(max_length=100, blank=True, default='')
    ieee_id_card = models.FileField(
        upload_to=ieee_card_upload_path,
        blank=True,
        null=True,
        validators=[validate_id_card_file],
        help_text="Uploaded IEEE membership card (.jpg, .png, or .pdf, max 5 MB)",
    )

    # Organizer-authoritative verification flag — only set via admin.
    ieee_verified = models.BooleanField(
        default=False,
        help_text="Set by admin after verifying IEEE membership credentials.",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'events'
        unique_together = ('team', 'email')
        ordering = ['id']
        verbose_name = 'Team Member'
        verbose_name_plural = 'Team Members'

    def __str__(self):
        role = " (IEEE)" if self.ieee_member else ""
        return f"{self.full_name}{role} - {self.team.team_name}"
