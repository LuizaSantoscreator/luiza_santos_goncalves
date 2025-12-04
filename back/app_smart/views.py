from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import timedelta
import pandas as pd

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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'ambiente']

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtros personalizados
        tipo = self.request.query_params.get('tipo')
        status_sensor = self.request.query_params.get('status')
        
        if tipo:
            # icontains: Busca parcial que ignora maiúsculas/minúsculas (Ex: "temp" acha "Temperatura")
            queryset = queryset.filter(sensor__icontains=tipo)
        
        if status_sensor:
            # Converte string 'true'/'false' para booleano
            is_active = status_sensor.lower() == 'true'
            queryset = queryset.filter(status=is_active)
            
        return queryset

class HistoricoViewSet(viewsets.ModelViewSet):
    queryset = Historico.objects.all()
    serializer_class = HistoricoSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Implementação dos filtros exigidos no Critério 12
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 1. Filtro por Sensor (ID)
        sensor_id = self.request.query_params.get('sensor')
        if sensor_id:
            queryset = queryset.filter(sensor_id=sensor_id)
            
        # 2. Filtro por Data (Ano-Mês-Dia)
        data_filtro = self.request.query_params.get('data')
        if data_filtro:
            queryset = queryset.filter(timestamp__date=data_filtro)
            
        # 3. Filtro por Nome do Local (Ex: Laboratório)
        local_nome = self.request.query_params.get('local')
        if local_nome:
            queryset = queryset.filter(sensor__ambiente__local__nome__icontains=local_nome)
            
        return queryset

    # Regra de Negócio: Sensor Inativo não pode registrar medição
    def create(self, request, *args, **kwargs):
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

    # Endpoint Extra: Medições Recentes (Ex: /api/medicoes/recentes/?hours=48)
    @action(detail=False, methods=['get'])
    def recentes(self, request):
        hours = int(request.query_params.get('hours', 24)) # Padrão 24h
        threshold = timezone.now() - timedelta(hours=hours)
        
        medicoes = Historico.objects.filter(timestamp__gte=threshold).order_by('-timestamp')
        
        # Permite filtrar as recentes por sensor também
        sensor_id = request.query_params.get('sensor_id')
        if sensor_id:
            medicoes = medicoes.filter(sensor_id=sensor_id)
            
        serializer = self.get_serializer(medicoes, many=True)
        return Response(serializer.data)

    # Endpoint Bônus: Exportar para Excel
    @action(detail=False, methods=['get'])
    def exportar(self, request):
        # Aplica os mesmos filtros da listagem (pega o que o usuário filtrou na tela)
        queryset = self.filter_queryset(self.get_queryset())
        
        # Monta os dados para o Excel
        data = []
        for item in queryset:
            data.append({
                'ID Leitura': item.id,
                'Sensor': f"{item.sensor.sensor} (ID: {item.sensor.id})",
                'Valor': item.valor,
                'Unidade': item.sensor.unidade_med,
                'Data/Hora': item.timestamp.strftime('%d/%m/%Y %H:%M:%S'),
                'Ambiente': item.sensor.ambiente.descricao if item.sensor.ambiente else 'N/A',
                'Local': item.sensor.ambiente.local.nome if item.sensor.ambiente and item.sensor.ambiente.local else 'N/A'
            })
        
        df = pd.DataFrame(data)
        
        # Prepara a resposta como download de arquivo
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="historico_sensores.xlsx"'
        
        df.to_excel(response, index=False, engine='openpyxl')
        
        return response