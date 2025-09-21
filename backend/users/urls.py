# Este archivo define las rutas específicas de la app 'users'.
# Incluye endpoints para registrar usuarios, iniciar sesión con JWT, refrescar el token y consultar el perfil del usuario autenticado.

from django.urls import path
# Importa la función 'path' para definir rutas URL en Django.

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# Importa las vistas estándar de SimpleJWT:
# - TokenObtainPairView: para obtener access y refresh tokens.
# - TokenRefreshView: para refrescar el access token usando el refresh token.

from .views import RegisterView, PerfilView, PasswordResetRequestView, PasswordResetConfirmView
# Importa las vistas personalizadas:
# - RegisterView: para registrar nuevos usuarios.
# - PerfilView: para consultar o actualizar el perfil del usuario autenticado.

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    # Ruta para registrar un nuevo usuario.
    # Se conecta con la vista RegisterView, que usa el serializer RegisterSerializer.
    # El frontend envía una petición POST con los datos del usuario.

    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    # Ruta para iniciar sesión.
    # El frontend envía email y contraseña, y recibe access y refresh tokens.
    # Esta vista puede ser reemplazada por una personalizada si usas login por email (como MyTokenObtainPairView).

    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Ruta para refrescar el access token cuando expira.
    # El frontend envía el refresh token y recibe un nuevo access token.

     path("me/", PerfilView.as_view(), name="perfil"),
    # Ruta para consultar o actualizar el perfil del usuario autenticado.
    # Se conecta con la vista PerfilView, que usa el serializer PerfilUsuarioSerializer.
    # El frontend puede hacer GET para ver los datos o PUT/PATCH para actualizarlos.

    path("reset-password-request/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("reset-password/<uidb64>/<token>/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
]

# ¿Cómo se usa en el flujo?

    # El frontend hace POST /api/users/register/ → crea el usuario.

    # Luego hace POST /api/users/token/ → recibe los tokens JWT.

    # Usa GET /api/users/me/ → obtiene los datos del perfil.

    # Puede usar PUT /api/users/me/ → actualiza el perfil.

    # Si el token expira, hace POST /api/users/token/refresh/ → obtiene uno nuevo.