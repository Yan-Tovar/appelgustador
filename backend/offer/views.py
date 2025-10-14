# Este archivo define las vistas para la app 'offer'.
# Las vistas reciben las peticiones HTTP (GET, POST, PUT, DELETE), consultan los modelos, aplican permisos, y devuelven respuestas JSON usando los serializers.

from rest_framework import generics, permissions
# 'generics' proporciona vistas base para operaciones CRUD comunes (List, Create, Retrieve, Update, Destroy).
# 'permissions' permite controlar quién puede acceder a cada vista.

from .models import Offer
# Importa los modelos definidos en esta app. Se usarán para consultar la base de datos.

from .serializers import OfferSerializer
# Importa los serializers que transforman los datos del modelo en JSON y viceversa.

from users.models import Usuario
# Importa el modelo de usuario personalizado. Se usa para verificar roles en los permisos.

# Permisos personalizados
class IsAdminOrEmpleado(permissions.BasePermission):
    # Define un permiso personalizado que solo permite acceso a usuarios autenticados con rol 'administrador' o 'empleado'.

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol in ['administrador', 'empleado']
        # Verifica que el usuario esté autenticado y que su rol esté en la lista permitida.
        # Si no cumple, se bloquea el acceso a la vista.

# CRUD Ofertas
class OfferListCreateView(generics.ListCreateAPIView):
    # Vista que permite listar todas las ofertas (GET) y crear una nueva (POST).

    def get_queryset(self):
        return Offer.objects.filter(estado="activo")
    serializer_class = OfferSerializer
    permission_classes = [IsAdminOrEmpleado]
    # Solo administradores y empleados pueden acceder.

class OfferRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    # Vista que permite obtener (GET), actualizar (PUT/PATCH) o eliminar (DELETE) una oferta específica.

    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [IsAdminOrEmpleado]

# Flujo de datos

    # El frontend hace una petición a /api/offer/ofertas/ o /api/offer/ofertas/5/.

    # Django busca la URL en offer/urls.py y la conecta con una de estas vistas.

    # La vista verifica los permisos (IsAdminOrEmpleado).

    # Si el usuario tiene acceso, se consulta el modelo (Offer).

    # Los datos se transforman con el serializer y se devuelven en formato JSON al frontend.