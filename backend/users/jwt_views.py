# Este archivo define una vista personalizada para el login con JWT.
# Extiende la vista base de SimpleJWT para usar un serializer modificado que permite login por email y agrega datos extra al token.

from rest_framework_simplejwt.views import TokenObtainPairView
# Importa la vista base que maneja la obtención de access y refresh tokens en SimpleJWT.

from .jwt_serializers import MyTokenObtainPairSerializer
# Importa el serializer personalizado que define cómo se validan las credenciales y qué datos se incluyen en el token.

class MyTokenObtainPairView(TokenObtainPairView):
    # Define una vista personalizada para el endpoint /api/token/.
    # Esta vista se usará cuando el frontend envíe email y contraseña para iniciar sesión.

    serializer_class = MyTokenObtainPairSerializer
    # Indica que se debe usar el serializer personalizado.
    # Este serializer permite login por email y agrega campos como 'rol' y 'username' al token JWT.

# ¿Cómo se usa en el flujo?

    # El frontend envía una petición POST /api/token/ con email y contraseña.

    # Django redirige esa URL a esta vista (MyTokenObtainPairView).

    # La vista usa el serializer MyTokenObtainPairSerializer para validar al usuario.

    # Si las credenciales son correctas, se devuelve un token JWT con datos personalizados.

    # El frontend guarda el token y lo usa para acceder a rutas protegidas.
