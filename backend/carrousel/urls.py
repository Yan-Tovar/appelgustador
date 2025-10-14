from django.urls import path
# Importa la función 'path' para definir rutas URL en Django.
from .views import (
    CarrouselListCreateView,
    CarrouselRetrieveUpdateDestroyView,
)
# Importa las vistas que manejarán las operaciones para los carruseles.
# Estas vistas están basadas en clases (Class-Based Views) y usan DRF para responder con JSON.

urlpatterns = [

    path('carrusel/', CarrouselListCreateView.as_view(), name='carrousel-list-create'),
    #Ruta para listar los items de carrusel

    path('carrusel/<int:pk>/', CarrouselRetrieveUpdateDestroyView.as_view(), name='carrousel-detail'),
    # Ruta para obtener (GET), actualizar (PUT/PATCH) o eliminar (DELETE) un item específico por su ID.
    # Se conecta con la vista 'CarrouselRetrieveUpdateDestroyView'.
]
