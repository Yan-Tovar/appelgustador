from django.db import models

class Categoria(models.Model):
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    ]

    nombre = models.CharField(max_length=100, unique=True)
    imagen = models.ImageField(upload_to='categorias/', blank=True, null=True)
    descripcion = models.TextField(blank=True)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='activo')

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    ]

    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos')
    nombre = models.CharField(max_length=150)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='activo')
    ingredientes = models.TextField(blank=True)
    instrucciones_conservacion = models.TextField(blank=True)
    instrucciones_uso = models.TextField(blank=True)

    def __str__(self):
        return self.nombre