# Este archivo define las vistas para la app 'productos'.
# Las vistas reciben las peticiones HTTP (GET, POST, PUT, DELETE), consultan los modelos, aplican permisos, y devuelven respuestas JSON usando los serializers.

from rest_framework import generics, permissions
# 'generics' proporciona vistas base para operaciones CRUD comunes (List, Create, Retrieve, Update, Destroy).
# 'permissions' permite controlar quién puede acceder a cada vista.

from .models import Categoria, Producto
# Importa los modelos definidos en esta app. Se usarán para consultar la base de datos.

from .serializers import CategoriaSerializer, ProductoSerializer
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

# CRUD Categorias
class CategoriaListCreateView(generics.ListCreateAPIView):
    # Vista que permite listar todas las categorías (GET) y crear una nueva (POST).

    queryset = Categoria.objects.all()
    # Define el conjunto de datos que se va a consultar: todas las categorías.

    serializer_class = CategoriaSerializer
    # Usa el serializer para transformar los datos del modelo en JSON y viceversa.

    permission_classes = [IsAdminOrEmpleado]
    # Aplica el permiso personalizado: solo administradores y empleados pueden acceder.

class CategoriaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    # Vista que permite obtener (GET), actualizar (PUT/PATCH) o eliminar (DELETE) una categoría específica.

    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdminOrEmpleado]
    # Igual que la vista anterior, pero aplicada a una categoría individual (por ID).

# CRUD Productos
class ProductoListCreateView(generics.ListCreateAPIView):
    # Vista que permite listar todos los productos (GET) y crear uno nuevo (POST).

    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAdminOrEmpleado]
    # Solo administradores y empleados pueden acceder.

class ProductoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    # Vista que permite obtener (GET), actualizar (PUT/PATCH) o eliminar (DELETE) un producto específico.

    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAdminOrEmpleado]

# Flujo de datos

    # El frontend hace una petición a /api/productos/productos/ o /api/productos/productos/5/.

    # Django busca la URL en productos/urls.py y la conecta con una de estas vistas.

    # La vista verifica los permisos (IsAdminOrEmpleado).

    # Si el usuario tiene acceso, se consulta el modelo (Producto o Categoria).

    # Los datos se transforman con el serializer y se devuelven en formato JSON al frontend.