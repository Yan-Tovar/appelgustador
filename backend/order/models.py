from django.db import models
from django.contrib.auth import get_user_model
from productos.models import Producto

User = get_user_model()

class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pendiente"),
        ("paid", "Pagado"),
        ("shipped", "Enviado"),
        ("completed", "Completado"),
        ("cancelled", "Cancelado"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Orden {self.id} - Usuario: {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def subtotal(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.producto.name}"
