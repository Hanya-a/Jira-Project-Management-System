from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import (
    ProjectModel,
    CardModel,
    Comment,
    HistoryModel,
    WorkLog,
    Move,
    Label,
    User,
)

admin.site.register(ProjectModel)
admin.site.register(CardModel)
admin.site.register(Comment)
admin.site.register(HistoryModel)
admin.site.register(WorkLog)
admin.site.register(Move)
admin.site.register(Label)
admin.site.register(User)