from rest_framework.routers import DefaultRouter
from .views.CardViews import CardViewSet
from .views.ProjectViews import ProjectViewSet
from .views.HistoryViews import HistoryViewSet
from .views.CommentViews import CommentViewSet
from .views.LabelViews import LabelViewSet
from .views.MoveViews import MoveViewSet
from .views.WorkLogViews import WorkLogViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("projects", ProjectViewSet,basename="projects")
router.register("cards", CardViewSet,basename="cards")
router.register("history",HistoryViewSet,basename="history")
router.register("comment",CommentViewSet,basename="comments")
router.register("label",LabelViewSet,basename="labels")
router.register("move",MoveViewSet,basename="move")
router.register("worklog",WorkLogViewSet,basename="worklog")
urlpatterns=router.urls