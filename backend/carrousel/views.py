# Este archivo define las vistas para la app 'carrousel'.
# Las vistas reciben las peticiones HTTP (GET, POST, PUT, DELETE), consultan los modelos, aplican permisos, y devuelven respuestas JSON usando los serializers.

from rest_framework import generics, permissions
# 'generics' proporciona vistas base para operaciones CRUD comunes (List, Create, Retrieve, Update, Destroy).
# 'permissions' permite controlar quién puede acceder a cada vista.

from .models import Carrusel
# Importa los modelos definidos en esta app. Se usarán para consultar la base de datos.

from .serializers import CarruselSerializer
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

# CRUD Carrusel
class CarrouselListCreateView(generics.ListCreateAPIView):
    # Vista que permite listar todos los items del carrusel (GET) y crear uno nuevo (POST).

    def get_queryset(self):
        return Carrusel.objects.filter(estado="activo")
    serializer_class = CarruselSerializer
    permission_classes = [IsAdminOrEmpleado]
    # Solo administradores y empleados pueden acceder.

    def perform_create(self, serializer):
        carrusel = serializer.save()
        registrar_historial(
            usuario=self.request.user,
            accion="creó el item de carrusel",
            objeto=str(carrusel.id),
            detalle=f"Nombre: {carrusel.nombre}"
        )

class CarrouselRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    # Vista que permite obtener (GET), actualizar (PUT/PATCH) o eliminar (DELETE) un item específico.

    queryset = Carrusel.objects.all()
    serializer_class = CarruselSerializer
    permission_classes = [IsAdminOrEmpleado]

    def perform_destroy(self, instance):
        registrar_historial(
            usuario=self.request.user,
            accion="eliminó el item del carrusel: ",
            objeto=str(instance.id),
            detalle=f"Nombre: {instance.nombre}"
        )
        instance.delete()

    def perform_update(self, serializer):
        carrusel = serializer.save()
        registrar_historial(
            usuario=self.request.user,
            accion="actualizó el item del carrusel",
            objeto=str(carrusel.id),
            detalle=f"Nombre actualizado: {carrusel.nombre}, descripcion: {carrusel.descripcion}, estado: {carrusel.estado}"
        )

# Flujo de datos

    # El frontend hace una petición a /api/productos/productos/ o /api/productos/productos/5/.

    # Django busca la URL en productos/urls.py y la conecta con una de estas vistas.

    # La vista verifica los permisos (IsAdminOrEmpleado).

    # Si el usuario tiene acceso, se consulta el modelo (Producto o Categoria).

    # Los datos se transforman con el serializer y se devuelven en formato JSON al frontend.