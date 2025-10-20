# Este archivo define las vistas para la app 'offer'.
# Las vistas reciben las peticiones HTTP (GET, POST, PUT, DELETE), consultan los modelos, aplican permisos, y devuelven respuestas JSON usando los serializers.

from rest_framework import generics, permissions
# 'generics' proporciona vistas base para operaciones CRUD comunes (List, Create, Retrieve, Update, Destroy).
# 'permissions' permite controlar quién puede acceder a cada vista.

from .models import Offer
# Importa los modelos definidos en esta app. Se usarán para consultar la base de datos.

from .serializers import OfferSerializer
# Importa los serializers que transforman los datos del modelo en JSON y viceversa.

from history.models import History  
# Importa el modelo de la app history para hacer los registros de historial.

def registrar_historial(usuario, accion, objeto, detalle=None):
    History.objects.create(
        usuario=usuario,
        accion=accion,
        objeto=objeto,
        detalle=detalle
    )


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

    def perform_create(self, serializer):
        offer = serializer.save()
        registrar_historial(
            usuario=self.request.user,
            accion="creó la oferta",
            objeto=str(offer.id_oferta),
            detalle=f"Oferta {offer.id_oferta}, Id_Producto: {offer.id_producto}, Estado: {offer.estado}"
        )

class OfferRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    # Vista que permite obtener (GET), actualizar (PUT/PATCH) o eliminar (DELETE) una oferta específica.

    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [IsAdminOrEmpleado]

    def perform_destroy(self, instance):
        registrar_historial(
            usuario=self.request.user,
            accion="eliminó la oferta: ",
            objeto=str(instance.id_oferta),
            detalle=f"Id_Oferta: {instance.id_oferta}"
        )
        instance.delete()

    def perform_update(self, serializer):
        offer = serializer.save()
        registrar_historial(
            usuario=self.request.user,
            accion="actualizó la oferta",
            objeto=str(offer.id_oferta),
            detalle=f"Oferta {offer.id_oferta}, Id_Producto: {offer.id_producto}, Estado: {offer.estado}"
        )

# Flujo de datos

    # El frontend hace una petición a /api/offer/ofertas/ o /api/offer/ofertas/5/.

    # Django busca la URL en offer/urls.py y la conecta con una de estas vistas.

    # La vista verifica los permisos (IsAdminOrEmpleado).

    # Si el usuario tiene acceso, se consulta el modelo (Offer).

    # Los datos se transforman con el serializer y se devuelven en formato JSON al frontend.