from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, ValidationError
from django_filters.rest_framework import DjangoFilterBackend

from ..models.CardModel import CardModel
from ..serializers.CardSerializer import CardSerializer
from ..models.HistoryModel import HistoryModel


class CardViewSet(viewsets.ModelViewSet):

    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = {
        "status": ["exact"],
        "priority": ["exact"],
        "assignee__username": ["iexact"],
        "reporter__username": ["iexact"],
        "project": ["exact"],
        "labels": ["exact"],
    }
    search_fields = ["name", "summary", "key"]

    ordering_fields = [
        "name",
        "priority",
        "status",
        "due_date",
        "created_at",
        "updated_at"
    ]

    def get_queryset(self):
        # Only project members can view cards
        return CardModel.objects.filter(
            project__members=self.request.user
        ).select_related(
            "project",
            "assignee",
            "reporter"
        )

    def perform_create(self, serializer):
        project = serializer.validated_data["project"]
        assignee = serializer.validated_data.get("assignee")
        user = self.request.user

        # Creator must be a project member
        if not project.members.filter(id=user.id).exists():
            raise PermissionDenied(
                "Only project members can create cards."
            )

        # Assignee must be a project member
        if assignee is not None:
            if not project.members.filter(id=assignee.id).exists():
                raise ValidationError(
                    "The assignee must be a member of the project."
                )

        # Creator automatically becomes the reporter
        card = serializer.save(reporter=user)

        # Generate card key
        card.key = f"CARD-{card.id}"
        card.save(update_fields=["key"])

        HistoryModel.objects.create(
            card=card,
            user=user,
            action="Card created",
            description=f"Created card {card.key}",
        )

    def perform_update(self, serializer):
        card = self.get_object()
        user = self.request.user


        # Store old values before updating
        old_name = card.name
        old_summary = card.summary
        old_status = card.status
        old_assignee = card.assignee
        old_priority = card.priority
        old_due_date = card.due_date
        old_labels =  set(card.labels.all())

        new_status = serializer.validated_data.get(
            "status",
            card.status
        )

        # Assignee permissions
        if user == card.assignee:
            # Assignee can change the status to anything except DONE
            if new_status == "done":
                raise PermissionDenied(
                    "The assignee cannot mark a card as DONE."
                )


        # Reporter permissions
        elif user == card.reporter:

            if new_status != "done":
                raise PermissionDenied(
                    "The reporter can only mark the card as DONE."
                )

        else:
            raise PermissionDenied(
                "You do not have permission to update this card."
            )

        serializer.save()
        card.refresh_from_db()

        if old_name != card.name:
            HistoryModel.objects.create(
                card=card,
                user=user,
                action="Name changed",
                description=f"Changed name from '{old_name}' to '{card.name}'",
            )

        if old_summary != card.summary:
            HistoryModel.objects.create(
                card=card,
                user=user,
                action="Summary changed",
                description="Card summary was changed.",
            )

        if old_status != card.status:
            HistoryModel.objects.create(
                card=card,
                user=user,
                action="Status changed",
                description=f"Changed status from {old_status} to {card.status}",
            )

        if old_assignee != card.assignee:
            old_assignee_name = (
                old_assignee.username
                if old_assignee
                else "Unassigned"
            )

            new_assignee_name = (
                card.assignee.username
                if card.assignee
                else "Unassigned"
            )

            HistoryModel.objects.create(
                card=card,
                user=user,
                action="Assignee changed",
                description=(
                    f"Changed assignee from {old_assignee_name} "
                    f"to {new_assignee_name}"
                ),
            )

        if old_priority != card.priority:
            HistoryModel.objects.create(
                card=card,
                user=user,
                action="Priority changed",
                description=(
                    f"Changed priority from {old_priority} "
                    f"to {card.priority}"
                ),
            )

        if old_due_date != card.due_date:
            HistoryModel.objects.create(
                card=card,
                user=user,
                action="Due date changed",
                description=(
                    f"Changed due date from {old_due_date} "
                    f"to {card.due_date}"
                ),
            )

        new_labels =  set(card.labels.all())

        if old_labels != new_labels:
            HistoryModel.objects.create(
                card=card,
                user=user,
                action="Labels changed",
                description="Card labels were changed.",
            )

    def perform_destroy(self, instance):
        # Only the assignee can delete the card
        if self.request.user != instance.assignee:
            raise PermissionDenied(
                "Only the card assignee can delete the card."
            )

        HistoryModel.objects.create(
            card=instance,
            user=self.request.user,
            action="Card deleted",
            description=f"Deleted card {instance.key}",
        )

        instance.delete()