from django.urls import path
# Importa la función 'path' para definir rutas URL en Django.
from . import views
# Importa las vistas que manejarán las operaciones para los pedidos.
# Estas vistas están basadas en clases (Class-Based Views) y usan DRF para responder con JSON.

urlpatterns = [

    path("", views.list_user_orders, name="list_orders"),
    #Ruta para listar los pedidos

    path("create/", views.create_order_from_cart, name="create_order"),
    # Ruta para crear un pedido.
]
