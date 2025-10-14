from django.db import models

class Carrusel(models.Model):
    ESTADO_CHOICES = [
        ('activo', 'activo'),
        ('inactivo', 'inactivo'),
    ]

    nombre = models.CharField(max_length=100, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to='carrusel/')
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='activo')
    link = models.URLField(max_length=500, blank=True, null=True, help_text="URL opcional a la que apuntará la imagen del carrusel")

    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre or f"Carrusel {self.id}"
