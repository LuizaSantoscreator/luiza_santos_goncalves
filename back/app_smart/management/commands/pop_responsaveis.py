from django.core.management.base import BaseCommand
from app_smart.models import Responsavel
import pandas as pd
import os

class Command(BaseCommand):
    help = 'Importa dados da tabela Responsavel via CSV'

    def handle(self, *args, **options):
        # Caminho do arquivo CSV (vamos supor que esteja na raiz do projeto 'back')
        file_path = os.path.join('dados', 'responsaveis.csv')

        try:
            df = pd.read_csv(file_path, sep=';') # Ajuste o sep se for vírgula
            
            for index, row in df.iterrows():
                nome = row['nome']
                
                # Cria se não existir (evita duplicidade)
                obj, created = Responsavel.objects.get_or_create(nome=nome)
                
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Responsável "{nome}" criado!'))
                else:
                    self.stdout.write(self.style.WARNING(f'Responsável "{nome}" já existe.'))
                    
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Arquivo não encontrado em: {file_path}'))