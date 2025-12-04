from django.core.management.base import BaseCommand
from app_smart.models import Local
import pandas as pd
import os

class Command(BaseCommand):
    help = 'Importa dados da tabela Local via CSV'

    def handle(self, *args, **options):
        file_path = os.path.join('dados', 'locais.csv')

        try:
            # Vamos tentar ler e imprimir o que o Pandas está enxergando
            df = pd.read_csv(file_path, sep=';')
            
            print("--- DEBUG: COLUNAS ENCONTRADAS NO ARQUIVO ---")
            print(df.columns.tolist())
            print("---------------------------------------------")

            # Normaliza as colunas (remove espaços e deixa minúsculo para facilitar)
            df.columns = [c.strip().lower() for c in df.columns]

            for index, row in df.iterrows():
                # Tenta achar o ID (pode ser 'id', 'ID', etc)
                local_id = row['id'] if 'id' in df.columns else None
                
                # Procura variantes de nome para a coluna Local
                nome_local = None
                if 'local' in df.columns:
                    nome_local = row['local']
                elif 'nome' in df.columns:
                    nome_local = row['nome']
                
                if not nome_local:
                    self.stdout.write(self.style.ERROR(f'Linha {index}: Coluna de nome não encontrada. Colunas disponíveis: {df.columns.tolist()}'))
                    continue

                # Cria ou atualiza
                if local_id:
                    obj, created = Local.objects.update_or_create(
                        id=local_id,
                        defaults={'nome': nome_local}
                    )
                else:
                    obj, created = Local.objects.get_or_create(nome=nome_local)
                
                action = 'criado' if created else 'atualizado'
                self.stdout.write(self.style.SUCCESS(f'Local {obj.id} - {obj.nome} {action}!'))
                    
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Arquivo não encontrado em: {file_path}'))