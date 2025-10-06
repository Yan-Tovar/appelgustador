from django.db import models
from order.models import Order  
from django.utils import timezone

class Invoice(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="invoice")
    numero_factura = models.CharField(max_length=20, unique=True)
    fecha_emision = models.DateTimeField(default=timezone.now)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    impuestos = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(
        max_length=20,
        choices=[("pagada", "Pagada"), ("pendiente", "Pendiente")],
        default="pendiente",
    )

    def __str__(self):
        return f"Factura {self.numero_factura} - Pedido {self.order.id}"