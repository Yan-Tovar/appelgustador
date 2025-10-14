from rest_framework import serializers
# Importa el módulo de serializers de Django REST Framework.
# Aquí usamos ModelSerializer para crear serializers basados en modelos.

from .models import Cart, CartItem
# Importa los modelos Cart y CartItem desde la app actual (suponiendo que este archivo está en la app 'cart').

from productos.models import Producto
# Importa el modelo Producto desde la app 'productos'.
# Se usa para serializar datos del producto dentro de los items del carrito.


class ProductoSerializer(serializers.ModelSerializer):
    # Define un serializer automático para el modelo Producto.
    # Se usa cuando queremos representar (mostrar) la información del producto
    # anidada dentro de un CartItem.

    class Meta:
        model = Producto
        # Indica que este serializer está ligado al modelo Producto.

        fields = ["id", "nombre", "precio"]
        # Lista explícita de campos a exponer del Producto.
        # IMPORTANTE: estos nombres deben coincidir exactamente con los campos del modelo Producto.
        # Si tu modelo usa 'nombre' y 'precio' deberías poner ["id", "nombre", "precio"].


class CartItemSerializer(serializers.ModelSerializer):
    # Serializer para representar y validar cada item del carrito (CartItem).

    producto = ProductoSerializer(read_only=True)
    # Campo anidado que utiliza ProductoSerializer para mostrar los datos del producto.
    # read_only=True = este campo se mostrará en las respuestas, pero no se usará para crear/actualizar.

    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(), source="producto", write_only=True
    )
    # Campo que permite enviar (en POST/PUT) solo el id del producto para relacionarlo con el CartItem.
    # - PrimaryKeyRelatedField: espera un valor entero (pk) que será usado para buscar el Producto.
    # - queryset=Producto.objects.all(): necesario para que DRF valide que ese id existe.
    # - source="producto": mapea este campo al atributo `producto` del modelo CartItem.
    #   Es decir, internamente asignará el Producto encontrado al atributo cart_item.producto.
    # - write_only=True: este campo se usa solo para entrada (requests), no aparecerá en la salida JSON.

    class Meta:
        model = CartItem
        # Indica que este serializer está ligado al modelo CartItem.

        fields = ["id", "producto", "product_id", "quantity", "subtotal"]
        # Campos expuestos en la API:
        # - id: id del CartItem
        # - producto: representación completa (anidada) del producto (solo lectura)
        # - producto_id: id para asignar el producto (solo escritura)
        # - quantity: cantidad del producto en el carrito
        # - subtotal: campo calculado (habitualmente una propiedad en el modelo, ej. producto.price * quantity)
        #
        # Nota: `subtotal` no es necesariamente un campo en la BD; si en tu modelo CartItem defines
        # @property def subtotal(self): return self.producto.price * self.quantity
        # entonces el serializer lo incluirá correctamente como atributo de solo lectura.


class CartSerializer(serializers.ModelSerializer):
    # Serializer para representar el carrito completo.

    items = CartItemSerializer(many=True, read_only=True)
    # Campo anidado que incluye todos los CartItem asociados al Cart.
    # - many=True indica que son múltiples objetos (lista).
    # - read_only=True porque normalmente el carrito se administra por endpoints
    #   que crean/actualizan CartItem individualmente (no se crea la lista completa desde aquí).
    # Nota: para que esto funcione, el modelo Cart debe tener una relación inversa desde CartItem
    # (por ejemplo ForeignKey(Cart, related_name="items")). Si el related_name es distinto,
    # aquí debes usar el nombre correcto.

    class Meta:
        model = Cart
        # Ligado al modelo Cart.

        fields = ["id", "user", "items", "created_at"]
        # Campos expuestos del carrito:
        # - id: identificador del carrito
        # - user: usuario propietario del carrito (normalmente es FK a User)
        # - items: la lista de CartItem (anidada)
        # - created_at: fecha de creación del carrito

        read_only_fields = ["user", "created_at"]
        # Estos campos no se permitirán en la entrada (POST/PUT) a través de este serializer.
        # - user se suele asignar automáticamente (ej. request.user)
        # - created_at es generado por la BD
