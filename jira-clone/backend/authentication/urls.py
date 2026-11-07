from rest_framework.routers import DefaultRouter
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views.RegisterView import RegisterView
from .views.LoginView import LoginView
from .views.LogoutView import LogoutView
from .views.TwoFactorSetupView import TwoFactorSetupView
from .views.TwoFactorSetupVerifyView import TwoFactorSetupVerifyView
from .views.Verify2FAView import Verify2FAView


router = DefaultRouter()

router.register("login", LoginView, basename="login")
router.register("logout", LogoutView, basename="logout")
router.register("register", RegisterView, basename="register")
router.register("2fa/setup", TwoFactorSetupView, basename="2fa-setup")
router.register("2fa/setup/verify", TwoFactorSetupVerifyView, basename="2fa-setup-verify")
router.register("2fa/verify", Verify2FAView, basename="2fa-verify")


urlpatterns = [
    path("token/refresh/", TokenRefreshView.as_view()),
    path("", include(router.urls)),
]