from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrador'),
        ('employee', 'Empleado'),
        ('customer', 'Cliente'),
    )

    # Rol
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    # Campos adicionales
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    pdf_document = models.FileField(upload_to="documents/", blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
