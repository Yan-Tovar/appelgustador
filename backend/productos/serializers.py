from rest_framework import serializers
from .models import Categoria, Producto

# Serializers para categorias
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

# Serializers para productos
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
