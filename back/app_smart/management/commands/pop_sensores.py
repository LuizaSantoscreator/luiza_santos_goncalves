from django.core.management.base import BaseCommand
from app_smart.models import Sensor, Ambiente
import pandas as pd
import os

class Command(BaseCommand):
    help = 'Importa Sensores buscando o Ambiente pelo nome (descrição)'

    def handle(self, *args, **options):
        file_path = os.path.join('dados', 'sensores.csv')

        try:
            df = pd.read_csv(file_path, sep=',')
            df.columns = [c.strip().lower() for c in df.columns]

            if len(df.columns) < 2:
                df = pd.read_csv(file_path, sep=';')
                df.columns = [c.strip().lower() for c in df.columns]

            for index, row in df.iterrows():
                
                tipo = (
                    row['tipo'] if 'tipo' in df.columns 
                    else row['sensor'] if 'sensor' in df.columns 
                    else None
                )
                if not tipo:
                    self.stdout.write(self.style.ERROR(f"Linha {index}: Tipo do sensor não encontrado."))
                    continue

                mac_address = row['mac_address'] if 'mac_address' in df.columns else None
                latitude = row['latitude'] if 'latitude' in df.columns else 0.0
                longitude = row['longitude'] if 'longitude' in df.columns else 0.0
                unidade_med = row['unidade_med'] if 'unidade_med' in df.columns else None

                # BUSCA DO AMBIENTE
                nome_ambiente = (
                    row['ambiente'] if 'ambiente' in df.columns else 
                    row['local'] if 'local' in df.columns else None
                )

                ambiente_obj = None
                if nome_ambiente:
                    ambiente_obj = Ambiente.objects.filter(descricao__icontains=nome_ambiente).first()
                    if not ambiente_obj:
                        ambiente_obj = Ambiente.objects.filter(local__nome__icontains=nome_ambiente).first()

                # fallback
                if not ambiente_obj:
                    ambiente_obj = Ambiente.objects.first()
                    if not ambiente_obj:
                        self.stdout.write(self.style.ERROR("Nenhum ambiente cadastrado. Rode pop_ambientes."))
                        return

                # CRIA UM NOVO SENSOR SEM VERIFICAR DUPLICIDADE
                sensor = Sensor.objects.create(
                    sensor=tipo,
                    mac_address=mac_address,
                    latitude=latitude,
                    longitude=longitude,
                    unidade_med=unidade_med,
                    ambiente=ambiente_obj,
                    status=True
                )

                self.stdout.write(self.style.SUCCESS(
                    f"Sensor criado! ID {sensor.id} - {sensor.sensor} ({mac_address})"
                ))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Arquivo não encontrado em: {file_path}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erro crítico: {e}'))
