from django.db import models

class Responsavel(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Local(models.Model):
    # No diagrama, o campo chama "Local", aqui usei 'nome' para ficar mais claro
    nome = models.CharField(max_length=100) #definindo tamanho

    def __str__(self):
        return self.nome

class Ambiente(models.Model):
    local = models.ForeignKey(Local, on_delete=models.PROTECT)
    descricao = models.CharField(max_length=200)
    responsavel = models.ForeignKey(Responsavel, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.local.nome} - {self.descricao}"

class Sensor(models.Model):
    TIPOS_SENSOR_CHOICES = [
        ('Temperatura', 'Temperatura'),
        ('Umidade', 'Umidade'),
        ('Luminosidade', 'Luminosidade'),
        ('Contador', 'Contador'),
    ]

    sensor = models.CharField(max_length=20, choices=TIPOS_SENSOR_CHOICES)
    mac_address = models.CharField(max_length=20, null=True, blank=True)
    unidade_med = models.CharField(max_length=10, null=True, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.BooleanField(default=True)
    ambiente = models.ForeignKey(Ambiente, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f"{self.sensor} - {self.ambiente}"

class Historico(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    valor = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp'] # Ordena do mais recente para o mais antigo
