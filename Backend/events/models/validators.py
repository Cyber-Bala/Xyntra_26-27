import os
import uuid
from datetime import timedelta

from django.core.exceptions import ValidationError
from django.utils import timezone

# ---------------------------------------------------------------------------
# File Magic-Byte Signatures
# ---------------------------------------------------------------------------

_PDF_MAGIC = b"%PDF-"
_PPTX_MAGIC = b"PK\x03\x04"                  # OOXML ZIP container
_PPT_MAGIC = bytes.fromhex("D0CF11E0A1B11AE1")  # OLE compound document
_JPEG_MAGIC = b"\xFF\xD8\xFF"
_PNG_MAGIC = b"\x89PNG"


# ---------------------------------------------------------------------------
# File Validators
# ---------------------------------------------------------------------------

def validate_ppt_file(file):
    """
    Validates uploaded presentation file format (extension + magic bytes)
    and enforces a 10 MB size limit.
    """
    max_size_bytes = 10 * 1024 * 1024
    if file.size > max_size_bytes:
        size_in_mb = file.size / (1024 * 1024)
        raise ValidationError(
            f"File size ({size_in_mb:.1f} MB) exceeds maximum allowed limit of 10 MB."
        )

    name = file.name.lower()
    valid_extensions = (".ppt", ".pptx", ".pdf")
    ext = os.path.splitext(name)[1]
    if ext not in valid_extensions:
        raise ValidationError(
            f"Unsupported file type '{ext}'. "
            f"Allowed extensions are: {', '.join(valid_extensions)}"
        )

    # Read header to verify content matches the declared extension
    file.seek(0)
    header = file.read(16)
    file.seek(0)

    if ext == ".pdf":
        valid = header.startswith(_PDF_MAGIC)
    elif ext == ".pptx":
        valid = header.startswith(_PPTX_MAGIC)
    elif ext == ".ppt":
        valid = header.startswith(_PPT_MAGIC)
    else:
        valid = False

    if not valid:
        raise ValidationError(
            "File contents do not match the declared format."
        )


def validate_id_card_file(file):
    """
    Validates uploaded IEEE ID card format (extension + magic bytes)
    and enforces a 5 MB size limit.
    """
    max_size_bytes = 5 * 1024 * 1024
    if file.size > max_size_bytes:
        size_in_mb = file.size / (1024 * 1024)
        raise ValidationError(
            f"ID card file size ({size_in_mb:.1f} MB) exceeds maximum allowed limit of 5 MB."
        )

    name = file.name.lower()
    valid_extensions = (".jpg", ".jpeg", ".png", ".pdf")
    ext = os.path.splitext(name)[1]
    if ext not in valid_extensions:
        raise ValidationError(
            f"Unsupported ID card format '{ext}'. "
            f"Allowed extensions are: {', '.join(valid_extensions)}"
        )

    file.seek(0)
    header = file.read(16)
    file.seek(0)

    if ext in (".jpg", ".jpeg"):
        valid = header.startswith(_JPEG_MAGIC)
    elif ext == ".png":
        valid = header.startswith(_PNG_MAGIC)
    elif ext == ".pdf":
        valid = header.startswith(_PDF_MAGIC)
    else:
        valid = False

    if not valid:
        raise ValidationError(
            "File contents do not match the declared format."
        )


# ---------------------------------------------------------------------------
# Dynamic Upload Path Generators
# ---------------------------------------------------------------------------

def ppt_upload_path(instance, filename):
    """Generates partitioned, collision-resistant path for PPT submissions."""
    ext = os.path.splitext(filename)[1].lower()
    unique_suffix = uuid.uuid4().hex[:8]
    sanitized_team_name = "".join(
        c for c in instance.team_name if c.isalnum() or c in ('-', '_')
    ).strip()
    return f"ppts/event_{instance.event_id}/{sanitized_team_name}_{unique_suffix}{ext}"


def ieee_card_upload_path(instance, filename):
    """Generates partitioned path for IEEE ID card uploads."""
    ext = os.path.splitext(filename)[1].lower()
    unique_suffix = uuid.uuid4().hex[:8]
    sanitized_name = (
        "".join(c for c in instance.full_name if c.isalnum() or c in ('-', '_')).strip()
        or "member"
    )
    event_id = instance.team.event_id if instance.team_id else "general"
    team_id = instance.team_id if instance.team_id else "new"
    return f"ieee_cards/event_{event_id}/team_{team_id}/{sanitized_name}_{unique_suffix}{ext}"


# ---------------------------------------------------------------------------
# Default & Model-Level Validators
# ---------------------------------------------------------------------------

def _default_email_token_expiry():
    """Default expiry for email verification token (24 hours)."""
    return timezone.now() + timedelta(hours=24)


def validate_team_member_count(team):
    """
    Validates that a team has between 4 and 6 members.
    Call after all members have been created within the transaction.
    """
    count = team.members.count()
    if not 4 <= count <= 6:
        raise ValidationError(
            f"A team must contain between 4 and 6 members (has {count})."
        )
