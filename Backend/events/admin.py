from datetime import timedelta

from django.contrib import admin
from django.db import transaction
from django.db.models import Count, Q
from django.utils import timezone

from .models import Event, Team, TeamMember, Payment
from .utils import send_selection_payment_email


# ---------------------------------------------------------------------------
# Inlines
# ---------------------------------------------------------------------------

class TeamMemberInline(admin.TabularInline):
    """
    Shows all 4-6 team members directly on the Team admin page,
    including their IEEE membership card uploads.
    """
    model = TeamMember
    extra = 0
    fields = (
        'full_name', 'email', 'phone', 'college',
        'ieee_member', 'ieee_membership_id', 'ieee_id_card',
        'ieee_verified',
    )
    readonly_fields = ('full_name', 'email', 'phone', 'college')


class PaymentInline(admin.StackedInline):
    """
    Displays the payment transaction details inline with the Team.
    """
    model = Payment
    extra = 0
    readonly_fields = (
        'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature',
        'amount', 'status', 'created_at', 'updated_at',
    )
    can_delete = False


# ---------------------------------------------------------------------------
# Admin actions
# ---------------------------------------------------------------------------

@admin.action(description="★ Select teams and email Form 2 payment link")
def select_and_send_payment_links(modeladmin, request, queryset):
    """
    Marks selected teams as 'selected', sets a 7-day payment token expiry,
    and dispatches Form 2 payment links *after* the DB transaction commits.
    """
    selected_ids = []

    with transaction.atomic():
        teams = list(
            queryset.select_related(None).select_for_update().only(
                'id', 'selection_status', 'payment_token_expires_at',
            )
        )
        now = timezone.now()

        for team in teams:
            team.selection_status = Team.SelectionStatus.SELECTED
            team.payment_token_expires_at = now + timedelta(days=7)
            team.save(update_fields=[
                'selection_status', 'payment_token_expires_at', 'updated_at',
            ])
            selected_ids.append(team.pk)

    # External side effects happen *after* commit.
    for team in Team.objects.filter(pk__in=selected_ids).select_related('event'):
        transaction.on_commit(
            lambda t=team: send_selection_payment_email(t, request=request)
        )

    modeladmin.message_user(
        request,
        f"Successfully marked {len(selected_ids)} team(s) as SELECTED. "
        f"Payment link emails have been queued.",
    )


@admin.action(description="Mark teams as REJECTED")
def mark_as_rejected(modeladmin, request, queryset):
    """
    Marks selected teams as 'rejected' and correctly updates `updated_at`.
    """
    count = queryset.update(
        selection_status=Team.SelectionStatus.REJECTED,
        updated_at=timezone.now(),
    )
    modeladmin.message_user(request, f"Marked {count} team(s) as REJECTED.")


@admin.action(description="✓ Verify IEEE credentials for selected members")
def verify_ieee_credentials(modeladmin, request, queryset):
    """
    Sets ieee_verified=True for the selected TeamMember rows that have
    submitted IEEE membership ID and card.
    """
    eligible = queryset.filter(
        ieee_member=True,
    ).exclude(
        ieee_membership_id='',
    ).exclude(
        ieee_id_card='',
    ).exclude(
        ieee_id_card__isnull=True,
    )
    count = eligible.update(ieee_verified=True)
    modeladmin.message_user(
        request,
        f"Verified IEEE credentials for {count} member(s).",
    )


# ---------------------------------------------------------------------------
# Model admins
# ---------------------------------------------------------------------------

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'event_date',
        'registration_deadline',
        'regular_price',
        'ieee_price',
        'is_active',
        'is_registration_open',
    )
    list_filter = ('is_active',)
    search_fields = ('title', 'venue')
    ordering = ('-event_date',)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = (
        'team_name',
        'event',
        'leader_email',
        'leader_phone',
        'selection_status',
        'email_verified',
        'is_paid',
        'ieee_discount_eligible',
        'annotated_member_count',
        'registered_at',
    )
    list_filter = ('event', 'selection_status', 'email_verified', 'is_paid')
    search_fields = ('team_name', 'leader_email', 'leader_phone')
    inlines = [TeamMemberInline, PaymentInline]
    actions = [select_and_send_payment_links, mark_as_rejected]

    # State-machine integrity: prevent direct editing of derived/computed
    # state fields.  Transitions should go through explicit admin actions.
    readonly_fields = (
        'email_token',
        'email_token_expires_at',
        'payment_token',
        'payment_token_expires_at',
        'status_token',
        'registered_at',
        'updated_at',
        'email_verified',
        'is_paid',
    )

    def get_queryset(self, request):
        """
        Annotate member counts to avoid N+1 per-row queries when rendering
        list_display columns.
        """
        return (
            super()
            .get_queryset(request)
            .select_related('event')
            .annotate(
                _member_total=Count('members', distinct=True),
                _verified_ieee_total=Count(
                    'members',
                    filter=(
                        Q(members__ieee_verified=True)
                        & ~Q(members__ieee_membership_id='')
                        & Q(members__ieee_id_card__isnull=False)
                        & ~Q(members__ieee_id_card='')
                    ),
                    distinct=True,
                ),
            )
        )

    @admin.display(boolean=True, description="IEEE Eligible")
    def ieee_discount_eligible(self, obj):
        return (
            4 <= obj._member_total <= 6
            and obj._member_total == obj._verified_ieee_total
        )

    @admin.display(description="Members")
    def annotated_member_count(self, obj):
        return obj._member_total


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = (
        'full_name', 'team', 'email', 'college',
        'ieee_member', 'ieee_verified', 'ieee_membership_id', 'ieee_id_card',
    )
    list_filter = ('ieee_member', 'ieee_verified', 'college', 'team__event')
    search_fields = ('full_name', 'email', 'college', 'team__team_name')
    actions = [verify_ieee_credentials]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'razorpay_order_id',
        'team',
        'amount',
        'status',
        'created_at',
    )
    list_filter = ('status', 'created_at')
    search_fields = ('razorpay_order_id', 'razorpay_payment_id', 'team__team_name')
    readonly_fields = (
        'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature',
        'amount', 'status', 'created_at', 'updated_at',
    )
