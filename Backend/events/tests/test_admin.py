from datetime import timedelta
from unittest.mock import MagicMock, patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone

from ..admin import (
    mark_as_rejected,
    select_and_send_payment_links,
    verify_ieee_credentials,
)
from ..models import Team, TeamMember
from .base import BaseTestCase, JPEG_HEADER, PDF_HEADER


class AdminActionTests(BaseTestCase):
    def test_select_and_send_payment_links_action(self):
        ppt = SimpleUploadedFile("deck.pdf", PDF_HEADER, content_type="application/pdf")
        team = Team.objects.create(
            event=self.event,
            team_name="SelectAdminTeam",
            leader_email="lead@select.com",
            leader_phone="9876543210",
            ppt_file=ppt,
            selection_status=Team.SelectionStatus.PENDING,
        )

        fake_request = MagicMock()
        fake_modeladmin = MagicMock()

        with patch('events.services.emails.send_mail') as mock_send:
            mock_send.return_value = 1
            select_and_send_payment_links(
                fake_modeladmin,
                fake_request,
                Team.objects.filter(id=team.id),
            )

        team.refresh_from_db()
        self.assertEqual(team.selection_status, Team.SelectionStatus.SELECTED)
        self.assertIsNotNone(team.payment_token_expires_at)
        self.assertGreater(team.payment_token_expires_at, timezone.now())

    def test_mark_as_rejected_action(self):
        ppt = SimpleUploadedFile("deck.pdf", PDF_HEADER, content_type="application/pdf")
        team = Team.objects.create(
            event=self.event,
            team_name="RejectAdminTeam",
            leader_email="lead@reject.com",
            leader_phone="9876543210",
            ppt_file=ppt,
            selection_status=Team.SelectionStatus.PENDING,
        )

        fake_request = MagicMock()
        fake_modeladmin = MagicMock()

        mark_as_rejected(
            fake_modeladmin,
            fake_request,
            Team.objects.filter(id=team.id),
        )

        team.refresh_from_db()
        self.assertEqual(team.selection_status, Team.SelectionStatus.REJECTED)

    def test_verify_ieee_credentials_action(self):
        ppt = SimpleUploadedFile("deck.pdf", PDF_HEADER, content_type="application/pdf")
        card = SimpleUploadedFile("card.jpg", JPEG_HEADER, content_type="image/jpeg")

        team = Team.objects.create(
            event=self.event,
            team_name="IEEEAdminTeam",
            leader_email="lead@ieee.com",
            leader_phone="9876543210",
            ppt_file=ppt,
        )
        member = TeamMember.objects.create(
            team=team,
            full_name="Alice IEEE",
            email="lead@ieee.com",
            phone="9876543210",
            college="MIT",
            ieee_member=True,
            ieee_membership_id="IEEE-12345",
            ieee_id_card=card,
            ieee_verified=False,
        )

        fake_request = MagicMock()
        fake_modeladmin = MagicMock()

        verify_ieee_credentials(
            fake_modeladmin,
            fake_request,
            TeamMember.objects.filter(id=member.id),
        )

        member.refresh_from_db()
        self.assertTrue(member.ieee_verified)
