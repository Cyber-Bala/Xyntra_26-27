from datetime import timedelta
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db.utils import IntegrityError

from ..models import (
    Event,
    Team,
    TeamMember,
    validate_id_card_file,
    validate_ppt_file,
    validate_team_member_count,
)
from .base import (
    BaseTestCase,
    JPEG_HEADER,
    PDF_HEADER,
    PNG_HEADER,
    PPTX_HEADER,
)


class ModelTests(BaseTestCase):
    def test_event_countdown_and_deadline(self):
        self.assertTrue(self.event.is_registration_open)
        self.assertGreater(self.event.seconds_remaining, 0)

        self.event.registration_deadline = self.now - timedelta(hours=1)
        self.event.save()
        self.assertFalse(self.event.is_registration_open)

    # --- File validator: extension + magic bytes ---------------------------

    def test_ppt_valid_pdf(self):
        f = SimpleUploadedFile("slides.pdf", PDF_HEADER, content_type="application/pdf")
        validate_ppt_file(f)  # Should not raise.

    def test_ppt_valid_pptx(self):
        f = SimpleUploadedFile("slides.pptx", PPTX_HEADER, content_type="application/vnd.ms-powerpoint")
        validate_ppt_file(f)

    def test_ppt_wrong_extension(self):
        f = SimpleUploadedFile("notes.txt", b"plain text", content_type="text/plain")
        with self.assertRaises(ValidationError):
            validate_ppt_file(f)

    def test_ppt_wrong_magic_bytes(self):
        """A .pdf extension with non-PDF content must be rejected."""
        f = SimpleUploadedFile("fake.pdf", b"NOT-A-PDF-AT-ALL", content_type="application/pdf")
        with self.assertRaises(ValidationError) as ctx:
            validate_ppt_file(f)
        self.assertIn("contents do not match", str(ctx.exception))

    def test_ppt_oversized(self):
        oversized = b"0" * (11 * 1024 * 1024)
        f = SimpleUploadedFile("big.pptx", oversized, content_type="application/vnd.ms-powerpoint")
        with self.assertRaises(ValidationError):
            validate_ppt_file(f)

    def test_id_card_valid_jpeg(self):
        f = SimpleUploadedFile("id.jpg", JPEG_HEADER, content_type="image/jpeg")
        validate_id_card_file(f)

    def test_id_card_valid_png(self):
        f = SimpleUploadedFile("id.png", PNG_HEADER, content_type="image/png")
        validate_id_card_file(f)

    def test_id_card_wrong_extension(self):
        f = SimpleUploadedFile("hack.exe", b"malicious", content_type="application/octet-stream")
        with self.assertRaises(ValidationError):
            validate_id_card_file(f)

    def test_id_card_wrong_magic_bytes(self):
        """A .jpg extension with non-JPEG content must be rejected."""
        f = SimpleUploadedFile("fake.jpg", b"NOTAJPEG", content_type="image/jpeg")
        with self.assertRaises(ValidationError) as ctx:
            validate_id_card_file(f)
        self.assertIn("contents do not match", str(ctx.exception))

    def test_id_card_oversized(self):
        oversized = b"0" * (6 * 1024 * 1024)
        f = SimpleUploadedFile("big_id.jpg", oversized, content_type="image/jpeg")
        with self.assertRaises(ValidationError):
            validate_id_card_file(f)

    # --- Price constraints -------------------------------------------------

    def test_event_price_floor(self):
        """Prices must be >= 0.01."""
        self.event.regular_price = Decimal("0.00")
        with self.assertRaises(ValidationError):
            self.event.full_clean()

    def test_ieee_price_not_above_regular(self):
        """IEEE price must not exceed regular price."""
        self.event.ieee_price = Decimal("3000.00")
        with self.assertRaises(ValidationError):
            self.event.clean()

    # --- Single active-event constraint ------------------------------------

    def test_only_one_active_event(self):
        """Database must reject a second active event."""
        with self.assertRaises(IntegrityError):
            Event.objects.create(
                title="XYNTRA 2027",
                event_date=self.now + timedelta(days=365),
                registration_deadline=self.now + timedelta(days=350),
                venue="Another Venue",
                regular_price=Decimal("2000.00"),
                ieee_price=Decimal("1500.00"),
                is_active=True,
            )

    # --- IEEE discount logic (uses ieee_verified) --------------------------

    def test_ieee_discount_requires_verified_flag(self):
        ppt = SimpleUploadedFile("deck.pptx", PPTX_HEADER, content_type="application/vnd.ms-powerpoint")
        card1 = SimpleUploadedFile("c1.jpg", JPEG_HEADER, content_type="image/jpeg")
        card2 = SimpleUploadedFile("c2.jpg", JPEG_HEADER, content_type="image/jpeg")

        team = Team.objects.create(
            event=self.event,
            team_name="VerifyTeam",
            leader_email="leader@test.edu",
            leader_phone="9876543210",
            ppt_file=ppt,
        )

        m1 = TeamMember.objects.create(
            team=team, full_name="Alice", email="leader@test.edu",
            phone="1111111111", college="MIT",
            ieee_member=True, ieee_membership_id="IEEE-001", ieee_id_card=card1,
            ieee_verified=False,  # not yet verified by admin
        )
        m2 = TeamMember.objects.create(
            team=team, full_name="Bob", email="bob@test.edu",
            phone="2222222222", college="MIT",
            ieee_member=True, ieee_membership_id="IEEE-002", ieee_id_card=card2,
            ieee_verified=False,
        )

        # Self-attested but not admin-verified → no discount.
        self.assertFalse(team.qualifies_for_ieee_discount)

        # Admin verifies both.
        m1.ieee_verified = True
        m1.save()
        m2.ieee_verified = True
        m2.save()

        # Force re-evaluation (clear cached queryset).
        team = Team.objects.get(pk=team.pk)
        self.assertTrue(team.qualifies_for_ieee_discount)

    # --- Team name uniqueness ----------------------------------------------

    def test_unique_team_name_per_event(self):
        ppt = SimpleUploadedFile("deck.pptx", PPTX_HEADER, content_type="application/vnd.ms-powerpoint")
        Team.objects.create(
            event=self.event, team_name="AlphaSquad",
            leader_email="a1@test.edu", leader_phone="9876543210", ppt_file=ppt,
        )
        with self.assertRaises(IntegrityError):
            Team.objects.create(
                event=self.event, team_name="AlphaSquad",
                leader_email="a2@test.edu", leader_phone="9876543211", ppt_file=ppt,
            )

    # --- Team member count validation --------------------------------------

    def test_validate_team_member_count(self):
        ppt = SimpleUploadedFile("deck.pptx", PPTX_HEADER, content_type="application/vnd.ms-powerpoint")
        team = Team.objects.create(
            event=self.event, team_name="TooSmall",
            leader_email="a@test.edu", leader_phone="0000000000", ppt_file=ppt,
        )
        # Zero members → invalid.
        with self.assertRaises(ValidationError):
            validate_team_member_count(team)

    # --- Token fields exist ------------------------------------------------

    def test_team_has_status_token(self):
        ppt = SimpleUploadedFile("deck.pptx", PPTX_HEADER, content_type="application/vnd.ms-powerpoint")
        team = Team.objects.create(
            event=self.event, team_name="TokenTeam",
            leader_email="t@test.edu", leader_phone="1234567890", ppt_file=ppt,
        )
        self.assertIsNotNone(team.status_token)
        self.assertIsNotNone(team.email_token_expires_at)
