# Este archivo define las rutas específicas de la app 'productos'.
# Cada ruta conecta una URL con una vista que gestiona operaciones sobre productos o categorías.
# Estas rutas se incluyen en el archivo principal 'config/urls.py' mediante include('productos.urls').

from django.urls import path
# Importa la función 'path' para definir rutas URL en Django.

from .views import (
    CategoriaListCreateView,
    CategoriaRetrieveUpdateDestroyView,
    ProductoListCreateView,
    ProductoRetrieveUpdateDestroyView,
    ProductosDisponiblesView
)
# Importa las vistas que manejarán las operaciones CRUD para categorías y productos.
# Estas vistas están basadas en clases (Class-Based Views) y usan DRF para responder con JSON.

urlpatterns = [
    # Categorías
    path('categorias/', CategoriaListCreateView.as_view(), name='categoria-list-create'),
    # Ruta para listar todas las categorías (GET) o crear una nueva (POST).
    # Se conecta con la vista 'CategoriaListCreateView'.

    path('categorias/<int:pk>/', CategoriaRetrieveUpdateDestroyView.as_view(), name='categoria-detail'),
    # Ruta para obtener (GET), actualizar (PUT/PATCH) o eliminar (DELETE) una categoría específica por su ID (pk).
    # Se conecta con la vista 'CategoriaRetrieveUpdateDestroyView'.

    # Productos
    path('productos/', ProductoListCreateView.as_view(), name='producto-list-create'),
    # Ruta para listar todos los productos (GET) o crear uno nuevo (POST).
    # Se conecta con la vista 'ProductoListCreateView'.

    path('productos/<int:pk>/', ProductoRetrieveUpdateDestroyView.as_view(), name='producto-detail'),
    # Ruta para obtener (GET), actualizar (PUT/PATCH) o eliminar (DELETE) un producto específico por su ID.
    # Se conecta con la vista 'ProductoRetrieveUpdateDestroyView'.

    path("disponibles/", ProductosDisponiblesView.as_view(), name="productos-disponibles"),
    #Ruta para obtener el listado de productos solamente disponibles para el flujo de compra
]

# Flujo de datos

    # Cuando el frontend hace una petición a /api/productos/productos/, Django busca esta ruta en productos/urls.py.

    # La ruta se conecta con una vista que consulta el modelo Producto, usa el ProductoSerializer y responde con JSON.

    # Este archivo permite que cada recurso tenga su propio endpoint RESTful, siguiendo buenas prácticas de diseño de APIs.