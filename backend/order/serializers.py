# Importamos serializers de Django REST Framework
from rest_framework import serializers

# Importamos los modelos Order y OrderItem de esta app
from .models import Order, OrderItem

# Importamos el modelo Producto (porque un OrderItem está relacionado con un producto)
from productos.models import Producto


# Serializer para los ítems del pedido
class OrderItemSerializer(serializers.ModelSerializer):
    # Creamos un campo extra llamado "producto_nombre" que muestra el nombre del producto relacionado
    # source="producto.name" -> toma el atributo 'name' desde el modelo Producto relacionado
    # read_only=True -> significa que solo se muestra en las respuestas, no se envía al crear
    producto_nombre = serializers.CharField(source="producto.nombre", read_only=True)

    class Meta:
        # Indicamos el modelo que este serializer usará
        model = OrderItem
        # Definimos los campos que se incluirán en la API
        fields = ["id", "producto", "producto_nombre", "quantity", "price", "subtotal"]

# Serializer para el pedido completo
class OrderSerializer(serializers.ModelSerializer):
    # Relación con los items: un pedido puede tener varios ítems
    # many=True -> porque es una lista
    # read_only=True -> el cliente no envía los ítems, se generan automáticamente en el backend
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        # Indicamos el modelo que se serializa
        model = Order
        # Definimos los campos que aparecerán en el JSON de respuesta
        fields = ["id", "user", "created_at", "status", "total", "items"]
        # Estos campos no pueden ser enviados desde el frontend porque se llenan automáticamente
        # - user -> se asigna al usuario autenticado
        # - created_at -> fecha de creación automática
        # - total -> se calcula con los ítems
        # - status -> inicia con un valor por defecto (ej. "pendiente")
        read_only_fields = ["user", "created_at", "total", "status"]
