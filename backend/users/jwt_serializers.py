# Este archivo define un serializer personalizado para el proceso de autenticación con JWT.
# Permite que los usuarios inicien sesión usando su email en lugar de username.
# Además, agrega campos personalizados (como rol y username) al token JWT que se devuelve al frontend.

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# Importa el serializer base de SimpleJWT que maneja la obtención de access y refresh tokens.

from rest_framework import serializers
# Importa el módulo de serializers de DRF. No se usa directamente aquí, pero puede ser útil si se extiende más adelante.

from .models import Usuario
# Importa el modelo de usuario personalizado. Se usa para acceder a atributos como 'rol' y 'username'.

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Extiende el serializer base de SimpleJWT para personalizar el proceso de login y el contenido del token.

    username_field = 'email'  # indicamos que el login será por email
    # Sobrescribe el campo por defecto ('username') para que el login se haga usando el campo 'email'.

    def validate(self, attrs):
        # Este método valida las credenciales enviadas por el usuario (email y contraseña).
        # Aquí podrías agregar validaciones adicionales si lo necesitas.

        # Simple JWT ahora enviará 'email' como username_field
        # Mantenemos todo el flujo original
        return super().validate(attrs)
        # Llama al método original para mantener el comportamiento estándar de SimpleJWT.

    @classmethod
    def get_token(cls, user):
        # Este método se ejecuta después de validar al usuario.
        # Permite agregar información adicional al token JWT.

        token = super().get_token(user)
        # Obtiene el token base generado por SimpleJWT.

        token['rol'] = user.rol
        # Agrega el campo 'rol' al token. Esto permite que el frontend sepa qué tipo de usuario está logueado.

        token['username'] = user.username
        # Agrega el campo 'username' al token. Puede ser útil para mostrar el nombre en la interfaz.

        return token
        # Devuelve el token modificado con los campos extra.

# Flujo de datos

    # El frontend hace una petición POST /api/token/ con email y contraseña.

    # Django usa este serializer para validar al usuario y generar los tokens.

    # El token JWT devuelto incluye access, refresh, y además rol y username.

    # El frontend puede usar esos datos para redirigir al usuario según su rol o mostrar su nombre.