from django.core.management.base import BaseCommand
from app_smart.models import Ambiente, Local, Responsavel
import pandas as pd
import os

class Command(BaseCommand):
    help = 'Importa Ambientes carregando Local e Responsavel pelo nome'

    def handle(self, *args, **options):
        file_path = os.path.join('dados', 'ambientes.csv')

        try:
            # Tenta ler com vírgula (que o log mostrou ser o correto)
            df = pd.read_csv(file_path, sep=',')

            # Limpeza dos nomes das colunas
            df.columns = [c.strip().lower() for c in df.columns]
            
            # Se por acaso o separador for ponto e vírgula, tenta corrigir
            if len(df.columns) < 3:
                df = pd.read_csv(file_path, sep=';')
                df.columns = [c.strip().lower() for c in df.columns]

            print("--- Colunas detectadas:", df.columns.tolist())

            for index, row in df.iterrows():
                # Verifica se as colunas essenciais existem
                if 'local' not in df.columns or 'responsavel' not in df.columns:
                    self.stdout.write(self.style.ERROR("Erro: O arquivo precisa ter as colunas 'local' e 'responsavel'."))
                    return

                nome_local = row['local']
                descricao = row['descricao'] if 'descricao' in df.columns else ''
                nome_responsavel = row['responsavel']

                # 1. Busca ou Cria o Local pelo nome
                local_obj, _ = Local.objects.get_or_create(nome=nome_local)

                # 2. Busca ou Cria o Responsável pelo nome
                resp_obj, created_resp = Responsavel.objects.get_or_create(nome=nome_responsavel)
                if created_resp:
                    self.stdout.write(self.style.WARNING(f'Responsável "{nome_responsavel}" criado.'))

                # 3. Cria o Ambiente
                # Aqui usamos get_or_create para evitar duplicatas se rodar duas vezes
                ambiente, created = Ambiente.objects.get_or_create(
                    local=local_obj,
                    responsavel=resp_obj,
                    defaults={'descricao': descricao}
                )
                
                if not created:
                    # Se já existe, atualiza a descrição
                    ambiente.descricao = descricao
                    ambiente.save()

                action = 'criado' if created else 'atualizado'
                self.stdout.write(self.style.SUCCESS(f'Ambiente no {local_obj.nome} {action}!'))
                    
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Arquivo não encontrado em: {file_path}'))