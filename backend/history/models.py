from django.db import models
from users.models import Usuario

class History(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    accion = models.CharField(max_length=255)  
    objeto = models.CharField(max_length=255) 
    fecha = models.DateTimeField(auto_now_add=True)
    detalle = models.TextField(blank=True, null=True) 

    def __str__(self):
        return f"{self.usuario} {self.accion} {self.objeto} a las {self.fecha.strftime('%H:%M %p')}"
