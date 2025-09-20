# Este archivo define los serializers para la app 'productos'.
# Los serializers convierten instancias de modelos (como Producto y Categoria) en datos JSON que se pueden enviar al frontend.
# También validan y transforman datos JSON recibidos desde el frontend para crear o actualizar objetos en la base de datos.

from rest_framework import serializers
# Importa el módulo de serializers de Django REST Framework. Es la base para crear serializers personalizados o automáticos.

from .models import Categoria, Producto
# Importa los modelos definidos en esta app. Se usarán como base para construir los serializers.

# Serializers para categorias
class CategoriaSerializer(serializers.ModelSerializer):
    # Define un serializer automático para el modelo Categoria.
    # ModelSerializer crea los campos automáticamente basándose en el modelo.

    class Meta:
        model = Categoria
        # Indica que este serializer se basa en el modelo Categoria.

        fields = '__all__'
        # Incluye todos los campos del modelo en el serializer.
        # Esto permite enviar y recibir todos los datos de una categoría (nombre, imagen, estado, etc.).

# Serializers para productos
class ProductoSerializer(serializers.ModelSerializer):
    # Define un serializer automático para el modelo Producto.

    class Meta:
        model = Producto
        # Indica que este serializer se basa en el modelo Producto.

        fields = '__all__'
        # Incluye todos los campos del modelo en el serializer.
        # Esto permite enviar y recibir todos los datos de un producto (nombre, precio, stock, imagen, etc.).

#Flujo de datos

    # Cuando el backend recibe una petición GET /api/productos/, este serializer convierte los objetos Producto en JSON.

    # Cuando el frontend envía una petición POST o PUT, el serializer valida los datos y los transforma en objetos Producto o Categoria.

    # Si necesitas controlar qué campos se exponen o agregar lógica personalizada (como validaciones o campos calculados), puedes extender estos serializers.