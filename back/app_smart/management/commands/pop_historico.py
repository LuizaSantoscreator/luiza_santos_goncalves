from django.core.management.base import BaseCommand
from app_smart.models import Sensor, Historico
from django.utils import timezone
from datetime import timedelta
import random

class Command(BaseCommand):
    help = 'Gera dados simulados de histórico para teste'

    def handle(self, *args, **options):
        sensores = Sensor.objects.all()

        if not sensores.exists():
            self.stdout.write(self.style.ERROR('Nenhum sensor encontrado. Rode pop_sensores primeiro.'))
            return

        Historico.objects.all().delete() # Limpa histórico antigo para não duplicar
        self.stdout.write(self.style.WARNING('Histórico antigo apagado.'))

        total_criado = 0
        
        for sensor in sensores:
            self.stdout.write(f'Gerando dados para: {sensor.sensor} (ID: {sensor.id})...')
            
            # Gera 50 medições por sensor nas últimas 24h
            for i in range(2):
                # Valor aleatório dependendo do tipo
                if sensor.sensor == 'Temperatura':
                    valor = round(random.uniform(20.0, 35.0), 1) # 20°C a 35°C
                elif sensor.sensor == 'Umidade':
                    valor = round(random.uniform(40.0, 90.0), 1) # 40% a 90%
                elif sensor.sensor == 'Luminosidade':
                    valor = round(random.uniform(100.0, 1000.0), 0) # Lux
                elif sensor.sensor == 'Contador':
                    valor = random.randint(0, 100)
                else:
                    valor = round(random.uniform(10.0, 50.0), 2)

                # Espalha o tempo para trás (ex: 30 min entre cada leitura)
                tempo_atras = timezone.now() - timedelta(minutes=i*30)

                Historico.objects.create(
                    sensor=sensor,
                    valor=valor,
                    timestamp=tempo_atras
                )
                total_criado += 1

        self.stdout.write(self.style.SUCCESS(f'Sucesso! {total_criado} registros de histórico criados.'))