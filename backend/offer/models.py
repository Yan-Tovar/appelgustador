from django.db import models
from productos.models import Producto

class Offer(models.Model):
    ESTADO_CHOICES = [
        ('activo', 'activo'),
        ('inactivo', 'inactivo'),
    ]
    id_oferta = models.AutoField(primary_key=True)
    detalle = models.TextField(blank=True, null=True)
    id_producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='offers/', blank=True, null=True)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='activo')
    fecha_hora_inicio = models.DateTimeField(auto_now_add=True)
    fecha_hora_fin = models.DateTimeField()

    class Meta:
        db_table = 'offer' 

    def __str__(self):
        return f"Oferta {self.id_oferta} - Producto {self.id_producto}"
