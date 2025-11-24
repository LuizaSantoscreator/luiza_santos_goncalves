from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# O Router cria as rotas automaticamente (ex: GET /sensores, POST /sensores)
router = DefaultRouter()
router.register(r'locais', views.LocalViewSet)
router.register(r'responsaveis', views.ResponsavelViewSet)
router.register(r'ambientes', views.AmbienteViewSet)
router.register(r'sensores', views.SensorViewSet)
router.register(r'medicoes', views.HistoricoViewSet) # Atenção: chamei de 'medicoes' na URL

urlpatterns = [
    path('', include(router.urls)),
]