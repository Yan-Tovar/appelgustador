# Este archivo define el modelo de usuario personalizado para tu proyecto.
# Extiende el modelo base de Django (AbstractUser) para agregar campos adicionales como rol, documento, dirección, etc.
# También modifica el sistema de login para que se use el email como identificador principal.

from django.db import models
# Importa el módulo para definir modelos y campos de base de datos.

from django.contrib.auth.models import AbstractUser
# Importa el modelo base de usuario que incluye autenticación, permisos, y campos estándar como username y password.

class Usuario(AbstractUser):
    # Define un modelo de usuario personalizado que hereda de AbstractUser.
    # Esto permite conservar funcionalidades como autenticación, pero agregar campos propios.

    ROLES = [
        ("administrador", "Administrador"),
        ("empleado", "Empleado"),
        ("cliente", "Cliente"),
    ]
    # Define los roles disponibles para los usuarios.
    # Se usan para controlar el acceso a vistas, funcionalidades y redirecciones en el frontend.

    rol = models.CharField(max_length=20, choices=ROLES, default="cliente")
    # Campo que almacena el rol del usuario.
    # Usa las opciones definidas en ROLES y por defecto asigna 'cliente'.

    # Email obligatorio y único para login
    email = models.EmailField(unique=True)
    # Campo obligatorio y único para el email.
    # Se usará como identificador principal en el login (USERNAME_FIELD).

    # Datos de identificación
    documento = models.CharField(max_length=50, unique=True, blank=True, null=True)
    # Número de documento del usuario. Opcional pero único si se proporciona.

    telefono = models.CharField(max_length=20, blank=True, null=True)
    # Número de teléfono del usuario. Opcional.

    # Datos de envío
    direccion = models.CharField(max_length=255, blank=True, null=True)
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    codigo_postal = models.CharField(max_length=20, blank=True, null=True)
    pais = models.CharField(max_length=100, blank=True, null=True)
    # Campos opcionales para almacenar la dirección de envío del usuario.
    # Útiles si el sistema incluye pedidos, entregas o facturación.

    # Configuración para login por email
    USERNAME_FIELD = 'email'
    # Indica que el campo 'email' será usado como identificador principal para iniciar sesión.
    # Reemplaza el uso tradicional de 'username'.

    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    # Campos obligatorios al crear un usuario desde la línea de comandos o el admin.
    # Aunque el login es por email, estos campos siguen siendo necesarios para compatibilidad.


    def __str__(self):
        return f"{self.username} ({self.rol})"
    # Define cómo se mostrará el usuario en el panel de administración o en el shell.
    # Muestra el username seguido del rol entre paréntesis.

# ¿Cómo se usa en el flujo?

    # Este modelo reemplaza el usuario estándar de Django.

    # Se usa en el login (/api/token/) para validar por email.

    # El campo rol se incluye en el token JWT y permite redirigir al usuario según su tipo.

    # Los datos de envío pueden usarse en formularios, pedidos o perfiles.