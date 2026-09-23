import json
import uuid
from datetime import timedelta

from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone

from ..models import Team
from .base import BaseTestCase, PDF_HEADER


class ViewTests(BaseTestCase):
    # --- Countdown ---------------------------------------------------------

    def test_countdown_api(self):
        response = self.client.get('/api/countdown/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['title'], "XYNTRA 2026")
        self.assertTrue(data['is_registration_open'])
        self.assertGreater(data['seconds_remaining'], 0)

    # --- Registration (Form 1) ---------------------------------------------

    def test_form1_registration_success(self):
        response = self._register_team()
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['selection_status'], 'pending')
        self.assertFalse(data['email_verified'])
        self.assertIn('status_token', data)

        team = Team.objects.get(team_name='DevTitans')
        self.assertEqual(team.selection_status, Team.SelectionStatus.PENDING)
        self.assertFalse(team.is_paid)

    def test_form1_rejects_duplicate_team_name(self):
        self._register_team(team_name="UniqueTeam", leader_email="a@test.edu")
        ppt = SimpleUploadedFile("deck2.pdf", PDF_HEADER, content_type="application/pdf")
        members = [
            {"full_name": f"M{i}", "email": f"dup{i}@test.edu", "phone": f"000000000{i}",
             "college": "U", "ieee_member": False, "ieee_membership_id": ""}
            for i in range(4)
        ]
        members[0]["email"] = "dupleader@test.edu"
        response = self.client.post('/api/register/', {
            'team_name': 'UniqueTeam',
            'leader_email': 'dupleader@test.edu',
            'leader_phone': '0000000000',
            'ppt_file': ppt,
            'members': json.dumps(members),
        })
        self.assertEqual(response.status_code, 409)

    def test_form1_rejects_duplicate_member_email(self):
        self._register_team()
        ppt = SimpleUploadedFile("deck2.pdf", PDF_HEADER, content_type="application/pdf")
        members = [
            {"full_name": "New Leader", "email": "newlead@test.edu", "phone": "1111111111",
             "college": "U", "ieee_member": False, "ieee_membership_id": ""},
            {"full_name": "Conflict", "email": "m2@college.edu", "phone": "2222222222",
             "college": "U", "ieee_member": False, "ieee_membership_id": ""},
            {"full_name": "M3", "email": "new3@test.edu", "phone": "3333333333",
             "college": "U", "ieee_member": False, "ieee_membership_id": ""},
            {"full_name": "M4", "email": "new4@test.edu", "phone": "4444444444",
             "college": "U", "ieee_member": False, "ieee_membership_id": ""},
        ]
        response = self.client.post('/api/register/', {
            'team_name': 'AnotherTeam',
            'leader_email': 'newlead@test.edu',
            'leader_phone': '1111111111',
            'ppt_file': ppt,
            'members': json.dumps(members),
        })
        self.assertEqual(response.status_code, 409)

    def test_form1_requires_card_for_ieee_member(self):
        ppt = SimpleUploadedFile("deck.pdf", PDF_HEADER, content_type="application/pdf")
        members = self._sample_members(all_ieee=True)
        response = self.client.post('/api/register/', {
            'team_name': 'MissingCards',
            'leader_email': 'leader@college.edu',
            'leader_phone': '9876543210',
            'ppt_file': ppt,
            'members': json.dumps(members),
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn("IEEE ID card file upload is required", response.json()['error'])

    def test_form1_type_coercion_string_false_rejected(self):
        """The string 'false' must not be coerced to True for ieee_member."""
        ppt = SimpleUploadedFile("deck.pdf", PDF_HEADER, content_type="application/pdf")
        members = self._sample_members()
        members[0]['ieee_member'] = "false"  # String, not bool
        response = self.client.post('/api/register/', {
            'team_name': 'TypeTest',
            'leader_email': 'leader@college.edu',
            'leader_phone': '9876543210',
            'ppt_file': ppt,
            'members': json.dumps(members),
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn("must be a boolean", response.json()['error'])

    def test_form1_oversized_members_json_rejected(self):
        """A very large members JSON blob should be rejected before parsing."""
        ppt = SimpleUploadedFile("deck.pdf", PDF_HEADER, content_type="application/pdf")
        huge_json = json.dumps([{"full_name": "X" * 1000}] * 200)
        response = self.client.post('/api/register/', {
            'team_name': 'BigPayload',
            'leader_email': 'leader@college.edu',
            'leader_phone': '9876543210',
            'ppt_file': ppt,
            'members': huge_json,
        })
        self.assertIn(response.status_code, [400, 413])

    # --- Email verification (POST) -----------------------------------------

    def test_verify_email_post_success(self):
        self._register_team()
        team = Team.objects.get(team_name='DevTitans')
        response = self.client.post(
            '/api/verify-email/',
            data=json.dumps({'token': str(team.email_token)}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        team.refresh_from_db()
        self.assertTrue(team.email_verified)

    def test_verify_email_get_rejected(self):
        """GET requests to verify-email must be rejected."""
        self._register_team()
        team = Team.objects.get(team_name='DevTitans')
        response = self.client.get(f'/api/verify-email/?token={team.email_token}')
        self.assertEqual(response.status_code, 405)

    def test_verify_email_expired_token(self):
        self._register_team()
        team = Team.objects.get(team_name='DevTitans')
        team.email_token_expires_at = timezone.now() - timedelta(hours=1)
        team.save()
        response = self.client.post(
            '/api/verify-email/',
            data=json.dumps({'token': str(team.email_token)}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 410)

    def test_verify_email_idempotent(self):
        self._register_team()
        team = Team.objects.get(team_name='DevTitans')
        payload = json.dumps({'token': str(team.email_token)})
        self.client.post('/api/verify-email/', data=payload, content_type='application/json')
        response = self.client.post('/api/verify-email/', data=payload, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("already verified", response.json()['message'])

    # --- Registration status (status_token) --------------------------------

    def test_registration_status_via_status_token(self):
        self._register_team()
        team = Team.objects.get(team_name='DevTitans')
        response = self.client.get(
            f'/api/registration-status/?status_token={team.status_token}'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['team_name'], 'DevTitans')
        self.assertEqual(data['selection_status'], 'pending')
        self.assertFalse(data['is_paid'])
        self.assertEqual(data['member_count'], 4)

    def test_registration_status_no_pii_leakage(self):
        self._register_team()
        team = Team.objects.get(team_name='DevTitans')
        response = self.client.get(
            f'/api/registration-status/?status_token={team.status_token}'
        )
        data = response.json()
        self.assertNotIn('members', data)
        self.assertNotIn('leader_phone', data)
        self.assertNotIn('payment', data)

    def test_registration_status_invalid_token(self):
        response = self.client.get(
            '/api/registration-status/?status_token=not-a-uuid'
        )
        self.assertEqual(response.status_code, 400)

    def test_registration_status_unknown_token(self):
        response = self.client.get(
            f'/api/registration-status/?status_token={uuid.uuid4()}'
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], "Registration not found.")

    def test_registration_status_email_no_longer_works(self):
        """The old ?email= parameter must not return data."""
        self._register_team()
        response = self.client.get(
            '/api/registration-status/?email=leader@college.edu'
        )
        self.assertEqual(response.status_code, 400)
