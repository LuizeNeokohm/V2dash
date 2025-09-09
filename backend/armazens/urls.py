from rest_framework.routers import DefaultRouter
from .views import ArmazemViewSet

router = DefaultRouter()
router.register(r'armazens', ArmazemViewSet, basename='armazens')

urlpatterns = router.urls
