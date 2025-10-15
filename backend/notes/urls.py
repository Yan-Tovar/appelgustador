from django.urls import path
# Importa la función 'path' para definir rutas URL en Django.
from .views import (
    NotesListCreateView,
    NotesRetrieveUpdateDestroyView,
)
# Importa las vistas que manejarán las operaciones para las notas.
# Estas vistas están basadas en clases (Class-Based Views) y usan DRF para responder con JSON.

urlpatterns = [

    path('notas/', NotesListCreateView.as_view(), name='notas-list-create'),
    #Ruta para listar las notas registradas o crear una nueva.

    path('notas/<int:pk>/', NotesRetrieveUpdateDestroyView.as_view(), name='notas-detail'),
    # Ruta para obtener (GET), actualizar (PUT/PATCH) o eliminar (DELETE) una nota específica por su ID.
    # Se conecta con la vista 'NotesRetrieveUpdateDestroyView'.
]
