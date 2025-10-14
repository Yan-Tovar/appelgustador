from django.urls import path
# Importa la función 'path' para definir rutas URL en Django.
from .views import (
    OfferListCreateView,
    OfferRetrieveUpdateDestroyView,
)
# Importa las vistas que manejarán las operaciones para los ofertas.
# Estas vistas están basadas en clases (Class-Based Views) y usan DRF para responder con JSON.

urlpatterns = [

    path('ofertas/', OfferListCreateView.as_view(), name='ofertas-list-create'),
    #Ruta para listar los items de Ofertas

    path('ofertas/<int:pk>/', OfferRetrieveUpdateDestroyView.as_view(), name='ofertas-detail'),
    # Ruta para obtener (GET), actualizar (PUT/PATCH) o eliminar (DELETE) un item específico por su ID.
    # Se conecta con la vista 'OfferRetrieveUpdateDestroyView'.
]
