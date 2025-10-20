from django.urls import path
# Importa la función 'path' para definir rutas URL en Django.
from .views import (
    HistoryListCreateView,
)
# Importa las vistas que manejarán las operaciones para las historial.
# Estas vistas están basadas en clases (Class-Based Views) y usan DRF para responder con JSON.

urlpatterns = [

    path('historial/', HistoryListCreateView.as_view(), name='historial-list-create'),
    #Ruta para listar el historial registrado o crear uno nuevo.

]
