from rest_framework import serializers
from .models import Invoice
from order.serializers import OrderSerializer
import uuid


class InvoiceSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Invoice.
    - Muestra el detalle del pedido con OrderSerializer.
    - Permite crear facturas enviando solo el order_id.
    """

    # Relación con el pedido (solo lectura, muestra todo el pedido con items incluidos)
    order = OrderSerializer(read_only=True)

    # Campo adicional para crear facturas a partir de un pedido
    order_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id",
            "numero_factura",
            "order",        # Detalle del pedido
            "order_id",     # Para crear la factura
            "subtotal",
            "impuestos",
            "total",
            "estado",
            "fecha_emision",
        ]
        read_only_fields = [
            "id",
            "numero_factura",
            "subtotal",
            "impuestos",
            "total",
            "estado",
            "fecha_emision",
            "order",
        ]

    def create(self, validated_data):
        """
        Crear una factura a partir de un pedido existente.
        """
        from order.models import Order 

        order_id = validated_data.pop("order")

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            raise serializers.ValidationError({"order_id": "Pedido no encontrado."})

        # Evitamos facturas duplicadas
        if hasattr(order, "invoice"):
            raise serializers.ValidationError({"order_id": "Este pedido ya tiene factura."})

        # Cálculo de totales
        subtotal = order.total
        impuestos = subtotal * 0.19
        total = subtotal + impuestos

        # Creamos la factura
        factura = Invoice.objects.create(
            order=order,
            numero_factura=str(uuid.uuid4())[:8],  # número corto único
            subtotal=subtotal,
            impuestos=impuestos,
            total=total,
            estado="pendiente",
        )

        return factura