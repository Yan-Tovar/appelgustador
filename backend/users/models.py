from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    ROLES = [
        ("administrador", "Administrador"),
        ("empleado", "Empleado"),
        ("cliente", "Cliente"),
    ]

    rol = models.CharField(max_length=20, choices=ROLES, default="cliente")

    # 🔹 Email obligatorio y único para login
    email = models.EmailField(unique=True)

    # Datos de identificación
    documento = models.CharField(max_length=50, unique=True, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)

    # Datos de envío
    direccion = models.CharField(max_length=255, blank=True, null=True)
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    codigo_postal = models.CharField(max_length=20, blank=True, null=True)
    pais = models.CharField(max_length=100, blank=True, null=True)

    # 🔹 Configuración para login por email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.username} ({self.rol})"