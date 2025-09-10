from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    ADMIN = "admin"
    EMPLEADO = "empleado"
    CLIENTE = "cliente"
    ROLE_CHOICES = [
        (ADMIN, "Administrador"),
        (EMPLEADO, "Empleado"),
        (CLIENTE, "Cliente"),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=CLIENTE)

    direccion = models.CharField(max_length=255, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    pdf_documento_identidad = models.FileField(upload_to="documentos/", blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()  # 👈 Aquí se enlaza el manager

    def __str__(self):
        return f"{self.email} ({self.role})"
