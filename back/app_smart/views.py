from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from datetime import timedelta
from django_filters.rest_framework import DjangoFilterBackend 
from .models import Sensor, Ambiente, Local, Responsavel, Historico
from .serializers import (
    SensorSerializer, AmbienteSerializer, LocalSerializer, 
    ResponsavelSerializer, HistoricoSerializer
)

class LocalViewSet(viewsets.ModelViewSet):
    queryset = Local.objects.all()
    serializer_class = LocalSerializer
    permission_classes = [permissions.IsAuthenticated]

class ResponsavelViewSet(viewsets.ModelViewSet):
    queryset = Responsavel.objects.all()
    serializer_class = ResponsavelSerializer
    permission_classes = [permissions.IsAuthenticated]

class AmbienteViewSet(viewsets.ModelViewSet):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer
    permission_classes = [permissions.IsAuthenticated]

class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtros exigidos: Tipo e Status
        tipo = self.request.query_params.get('tipo')
        status_sensor = self.request.query_params.get('status')
        
        if tipo:
            queryset = queryset.filter(sensor__icontains=tipo)
        
        if status_sensor:
            is_active = status_sensor.lower() == 'true'
            queryset = queryset.filter(status=is_active)
            
        return queryset

class HistoricoViewSet(viewsets.ModelViewSet):
    queryset = Historico.objects.all()
    serializer_class = HistoricoSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Implementando Filtros manuais para atender ao Critério 12
    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtro por Sensor
        sensor_id = self.request.query_params.get('sensor')
        if sensor_id:
            queryset = queryset.filter(sensor_id=sensor_id)
            
        # Filtro por Data
        data_filtro = self.request.query_params.get('data')
        if data_filtro:
            queryset = queryset.filter(timestamp__date=data_filtro)
            
        # --- NOVO: Filtro por Local (Ex: ?local=Laboratorio) ---
        local_nome = self.request.query_params.get('local')
        if local_nome:
            queryset = queryset.filter(sensor__ambiente__local__nome__icontains=local_nome)
            
        return queryset

    def create(self, request, *args, **kwargs):
        # Regra de Negócio: Sensor Inativo não grava
        sensor_id = request.data.get('sensor')
        try:
            sensor = Sensor.objects.get(id=sensor_id)
            if not sensor.status:
                return Response(
                    {"error": "Medição rejeitada. O sensor está inativo."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Sensor.DoesNotExist:
            return Response(
                {"error": "Sensor não encontrado."}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def recentes(self, request):
        # Endpoint extra: Últimas 24h
        hours = int(request.query_params.get('hours', 24))
        threshold = timezone.now() - timedelta(hours=hours)
        
        medicoes = Historico.objects.filter(timestamp__gte=threshold).order_by('-timestamp')
        
        sensor_id = request.query_params.get('sensor_id')
        if sensor_id:
            medicoes = medicoes.filter(sensor_id=sensor_id)
            
        serializer = self.get_serializer(medicoes, many=True)
        return Response(serializer.data)