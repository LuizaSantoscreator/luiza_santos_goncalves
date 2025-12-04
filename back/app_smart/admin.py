from django.contrib import admin
from .models import Sensor, Ambiente, Local, Responsavel, Historico

@admin.register(Local)
class LocalAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome')

@admin.register(Ambiente)
class AmbienteAdmin(admin.ModelAdmin):
    list_display = ('id', 'local', 'responsavel', 'descricao')
    search_fields = ('descricao',)

@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = ('id', 'sensor', 'mac_address', 'status', 'ambiente')
    list_filter = ('sensor', 'status', 'ambiente') # Cria filtros laterais
    search_fields = ('mac_address',)

@admin.register(Responsavel)
class ResponsavelAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome')

@admin.register(Historico)
class HistoricoAdmin(admin.ModelAdmin):
    list_display = ('id', 'sensor', 'valor', 'timestamp')
    list_filter = ('sensor', 'timestamp')