from django.core.management.base import BaseCommand
from app_smart.models import Sensor, Ambiente
import pandas as pd
import os

class Command(BaseCommand):
    help = 'Importa Sensores buscando o Ambiente pelo nome (descrição)'

    def handle(self, *args, **options):
        file_path = os.path.join('dados', 'sensores.csv')

        try:
            # 1. Tenta ler com vírgula (padrão do seu arquivo anterior)
            df = pd.read_csv(file_path, sep=',')
            
            # Limpa colunas (remove espaços e minúsculas)
            df.columns = [c.strip().lower() for c in df.columns]

            # Debug: Mostra o que ele leu
            print("--- Colunas do CSV de Sensores:", df.columns.tolist())

            # Se leu tudo numa coluna só, tenta ponto e vírgula
            if len(df.columns) < 2:
                print("Separador de vírgula falhou. Tentando ponto e vírgula...")
                df = pd.read_csv(file_path, sep=';')
                df.columns = [c.strip().lower() for c in df.columns]

            for index, row in df.iterrows():
                # Tenta pegar o ID se existir, senão é None
                sensor_id = row['id'] if 'id' in df.columns else None
                
                # Campos obrigatórios (ajuste conforme os nomes que aparecerem no print)
                # Tenta 'tipo' ou 'sensor'
                tipo = row['tipo'] if 'tipo' in df.columns else (row['sensor'] if 'sensor' in df.columns else None)
                
                if not tipo:
                    self.stdout.write(self.style.ERROR(f"Linha {index}: Tipo do sensor não encontrado."))
                    continue

                mac_address = row['mac_address'] if 'mac_address' in df.columns else None
                latitude = row['latitude'] if 'latitude' in df.columns else 0.0
                longitude = row['longitude'] if 'longitude' in df.columns else 0.0
                unidade_med = row['unidade_med'] if 'unidade_med' in df.columns else None
                
                # BUSCA DO AMBIENTE
                # Tenta achar uma coluna que indique o ambiente (pode ser 'ambiente', 'local', 'sala')
                nome_ambiente = None
                if 'ambiente' in df.columns:
                    nome_ambiente = row['ambiente']
                elif 'local' in df.columns: # Às vezes o CSV chama de local
                    nome_ambiente = row['local']
                
                ambiente_obj = None
                if nome_ambiente:
                    # Tenta achar um ambiente que tenha essa descrição
                    # OU um ambiente cujo local tenha esse nome
                    ambiente_obj = Ambiente.objects.filter(descricao__icontains=nome_ambiente).first()
                    if not ambiente_obj:
                         ambiente_obj = Ambiente.objects.filter(local__nome__icontains=nome_ambiente).first()
                
                if not ambiente_obj:
                    # Se não achou, pega o primeiro que tiver no banco só para não travar (fallback)
                    self.stdout.write(self.style.WARNING(f"Ambiente '{nome_ambiente}' não achado. Usando o primeiro disponível."))
                    ambiente_obj = Ambiente.objects.first()
                    if not ambiente_obj:
                        self.stdout.write(self.style.ERROR("Nenhum ambiente cadastrado no banco. Rode pop_ambientes primeiro."))
                        return

                # CRIAÇÃO DO SENSOR
                defaults = {
                    'sensor': tipo,
                    'mac_address': mac_address,
                    'latitude': latitude,
                    'longitude': longitude,
                    'unidade_med': unidade_med,
                    'ambiente': ambiente_obj,
                    'status': True 
                }

                if sensor_id:
                    obj, created = Sensor.objects.update_or_create(id=sensor_id, defaults=defaults)
                else:
                    obj, created = Sensor.objects.get_or_create(mac_address=mac_address, defaults=defaults)
                
                action = 'criado' if created else 'atualizado'
                self.stdout.write(self.style.SUCCESS(f'Sensor {obj.sensor} ({obj.id}) no {ambiente_obj} {action}!'))
                    
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Arquivo não encontrado em: {file_path}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erro crítico: {e}'))