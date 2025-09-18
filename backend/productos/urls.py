from django.urls import path
from .views import (
    CategoriaListCreateView,
    CategoriaRetrieveUpdateDestroyView,
    ProductoListCreateView,
    ProductoRetrieveUpdateDestroyView
)

urlpatterns = [
    # Categorías
    path('categorias/', CategoriaListCreateView.as_view(), name='categoria-list-create'),
    path('categorias/<int:pk>/', CategoriaRetrieveUpdateDestroyView.as_view(), name='categoria-detail'),

    # Productos
    path('productos/', ProductoListCreateView.as_view(), name='producto-list-create'),
    path('productos/<int:pk>/', ProductoRetrieveUpdateDestroyView.as_view(), name='producto-detail'),
]
