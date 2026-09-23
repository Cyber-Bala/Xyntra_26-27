import json
import shutil
import tempfile
from datetime import timedelta
from decimal import Decimal

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase, override_settings
from django.utils import timezone

from ..models import Event

# ---------------------------------------------------------------------------
# Valid Magic-Byte Headers for Tests
# ---------------------------------------------------------------------------

PDF_HEADER = b"%PDF-1.4 fakecontent"
PPTX_HEADER = b"PK\x03\x04" + b"\x00" * 100
JPEG_HEADER = b"\xFF\xD8\xFF\xE0" + b"\x00" * 100
PNG_HEADER = b"\x89PNG\r\n\x1a\n" + b"\x00" * 100


class BaseTestCase(TestCase):
    """
    Base test case that isolates media uploads to a temporary directory
    and configures consistent test credentials.
    """

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls._temp_media = tempfile.mkdtemp()
        cls._settings_override = override_settings(
            MEDIA_ROOT=cls._temp_media,
            SECRET_KEY='test-secret-key-for-unit-tests-only',
            RAZORPAY_KEY_ID='rzp_test_placeholder',
            RAZORPAY_KEY_SECRET='placeholder_secret',
        )
        cls._settings_override.enable()

    @classmethod
    def tearDownClass(cls):
        cls._settings_override.disable()
        shutil.rmtree(cls._temp_media, ignore_errors=True)
        super().tearDownClass()

    def setUp(self):
        super().setUp()
        self.client = Client()
        self.now = timezone.now()
        self.event = Event.objects.create(
            title="XYNTRA 2026",
            description="Inter-college national hackathon",
            event_date=self.now + timedelta(days=30),
            registration_deadline=self.now + timedelta(days=15),
            venue="Main Auditorium & Lab Complex",
            regular_price=Decimal("2000.00"),
            ieee_price=Decimal("1500.00"),
            is_active=True,
        )

    def _sample_members(self, leader_email="leader@college.edu", all_ieee=False):
        return [
            {
                "full_name": "Leader One",
                "email": leader_email,
                "phone": "9876543210",
                "college": "Tech Univ",
                "ieee_member": all_ieee,
                "ieee_membership_id": "IEEE-001" if all_ieee else "",
            },
            {
                "full_name": "Member Two",
                "email": "m2@college.edu",
                "phone": "9876543211",
                "college": "Tech Univ",
                "ieee_member": all_ieee,
                "ieee_membership_id": "IEEE-002" if all_ieee else "",
            },
            {
                "full_name": "Member Three",
                "email": "m3@college.edu",
                "phone": "9876543212",
                "college": "Tech Univ",
                "ieee_member": all_ieee,
                "ieee_membership_id": "IEEE-003" if all_ieee else "",
            },
            {
                "full_name": "Member Four",
                "email": "m4@college.edu",
                "phone": "9876543213",
                "college": "Tech Univ",
                "ieee_member": all_ieee,
                "ieee_membership_id": "IEEE-004" if all_ieee else "",
            },
        ]

    def _register_team(self, team_name="DevTitans", leader_email="leader@college.edu"):
        ppt = SimpleUploadedFile("deck.pdf", PDF_HEADER, content_type="application/pdf")
        members = self._sample_members(leader_email=leader_email)
        return self.client.post('/api/register/', {
            'team_name': team_name,
            'leader_email': leader_email,
            'leader_phone': '9876543210',
            'ppt_file': ppt,
            'members': json.dumps(members),
        })
