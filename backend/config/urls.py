# Este archivo define las rutas principales del proyecto Django.
# Aquí se incluyen las URLs globales que conectan con las apps internas (users, productos, etc.).
# También se configuran rutas especiales como autenticación (JWT), administración (admin), y archivos estáticos/media.
# Toda URL que sea parte del núcleo del proyecto o que conecte con una app debe incluirse aquí.

from users.jwt_views import MyTokenObtainPairView
# Importa una vista personalizada para obtener el token JWT. Esta vista reemplaza la estándar de DRF para agregar lógica extra (como incluir el rol del usuario en el token).

from rest_framework_simplejwt.views import TokenRefreshView
# Importa la vista estándar de DRF para refrescar el token JWT. Se usa cuando el access token expira y necesitas uno nuevo usando el refresh token.

from django.contrib import admin
# Importa el sistema de administración de Django. Esto permite acceder a /admin para gestionar modelos desde el navegador.

from django.urls import path, include
# 'path' se usa para definir rutas individuales.
# 'include' permite incluir rutas definidas en otras apps (como users.urls o productos.urls).

from django.conf import settings
# Importa la configuración global del proyecto (como MEDIA_URL, DEBUG, etc.).

from django.conf.urls.static import static
# Permite servir archivos estáticos y multimedia durante el desarrollo (como imágenes subidas por usuarios).

urlpatterns = [
    path('admin/', admin.site.urls),
    # Ruta para acceder al panel de administración de Django. Muy útil para gestionar datos sin crear vistas personalizadas.

    path("api/users/", include("users.urls")),
    # Incluye todas las rutas definidas en users/urls.py. Aquí irán endpoints como /api/users/me/, /api/users/register/, etc.

    path('api/productos/', include('productos.urls')),
    # Incluye las rutas de la app productos. Aquí podrían estar endpoints como /api/productos/list/, /api/productos/<id>/, etc.

    path("api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    # Endpoint para iniciar sesión. Recibe email y contraseña, y devuelve access y refresh tokens.
    # Este endpoint es clave para el flujo de autenticación JWT.

    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Endpoint para refrescar el access token usando el refresh token. Evita que el usuario tenga que iniciar sesión de nuevo.
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# Esta línea permite servir archivos multimedia (como imágenes subidas) desde MEDIA_URL durante el desarrollo.
# En producción, esto lo gestiona el servidor web (como Nginx), no Django.