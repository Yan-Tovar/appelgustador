from django.db import models

class Notes(models.Model):
    ESTADO_CHOICES = [
        ('activo', 'activo'),
        ('inactivo', 'inactivo'),
    ]

    titulo = models.CharField(max_length=100, blank=True, null=True)
    detalle = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='activo')
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo or f"Notes {self.id}"
