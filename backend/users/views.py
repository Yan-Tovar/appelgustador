# Este archivo define las vistas para registrar nuevos usuarios y consultar o actualizar el perfil del usuario autenticado.
# Usa vistas basadas en clases (Class-Based Views) de Django REST Framework.

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail

from rest_framework import generics, permissions
# 'generics' proporciona vistas base para operaciones comunes como CreateAPIView.
# 'permissions' permite aplicar reglas de acceso (como autenticación).

from rest_framework.response import Response
# Permite construir respuestas HTTP personalizadas con datos JSON.

from rest_framework.views import APIView
# Clase base para crear vistas personalizadas que no encajan en los genéricos.

from .models import Usuario
# Importa el modelo de usuario personalizado.

from .serializers import RegisterSerializer
# Importa el serializer que se usa para registrar nuevos usuarios.

from rest_framework.permissions import IsAuthenticated
# Permiso que exige que el usuario esté autenticado para acceder a la vista.

from rest_framework import status
# Proporciona códigos de estado HTTP como 200, 400, 401, etc.

from .serializers import PerfilUsuarioSerializer
# Importa el serializer que se usa para consultar y actualizar el perfil del usuario.

token_generator = PasswordResetTokenGenerator()

class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "El email es obligatorio"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"

        # Enviar correo (usa tu config SMTP en settings.py)
        send_mail(
            subject="Recuperación de contraseña",
            message=f"Usa este link para resetear tu contraseña: {reset_link}",
            from_email="no-reply@tusitio.com",
            recipient_list=[email],
        )

        return Response({"message": "Se envió el link de recuperación al correo"}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = Usuario.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response({"error": "Token inválido"}, status=status.HTTP_400_BAD_REQUEST)

        if not token_generator.check_token(user, token):
            return Response({"error": "Token inválido o expirado"}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get("password")
        if not new_password:
            return Response({"error": "Debes ingresar la nueva contraseña"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Contraseña restablecida exitosamente"}, status=status.HTTP_200_OK)

# Registro
class RegisterView(generics.CreateAPIView):
    # Vista para registrar nuevos usuarios.
    # Usa CreateAPIView, que maneja automáticamente peticiones POST para crear objetos.

    queryset = Usuario.objects.all()
    # Define el conjunto de usuarios disponibles. Requerido por CreateAPIView.

    serializer_class = RegisterSerializer
    # Usa el serializer personalizado para validar y crear el usuario.

    def perform_create(self, serializer):
        serializer.save()
        # Guarda el nuevo usuario en la base de datos.
        # El método 'create' del serializer se encarga de asignar el rol y encriptar la contraseña.


# Perfil del usuario autenticado
class PerfilView(APIView):
    # Vista personalizada para consultar y actualizar el perfil del usuario autenticado.
    # Usa APIView para tener control total sobre los métodos GET, PUT y PATCH.

    permission_classes = [IsAuthenticated]
    # Solo permite acceso a usuarios que hayan iniciado sesión.

    def get(self, request):
        serializer = PerfilUsuarioSerializer(request.user)
        # Crea un serializer con el usuario actual (request.user).

        return Response(serializer.data)
        # Devuelve los datos del perfil en formato JSON.

    def put(self, request):
        serializer = PerfilUsuarioSerializer(request.user, data=request.data)
        # Crea un serializer con los datos nuevos enviados por el frontend.

        if serializer.is_valid():
            serializer.save()
            # Si los datos son válidos, actualiza el perfil del usuario.

            return Response(serializer.data)
            # Devuelve los datos actualizados.

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # Si hay errores de validación, devuelve un error 400 con los detalles.

    def patch(self, request):
        serializer = PerfilUsuarioSerializer(request.user, data=request.data, partial=True)
        # Igual que PUT, pero permite enviar solo algunos campos (actualización parcial).

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ¿Cómo se usa el flujo?

    # El frontend hace POST /api/users/register/ → se ejecuta RegisterView.

    # Luego hace GET /api/users/me/ → se ejecuta PerfilView.get() y recibe los datos del perfil.

    # Si el usuario edita su perfil, se hace PUT o PATCH → se ejecuta PerfilView.put() o patch().