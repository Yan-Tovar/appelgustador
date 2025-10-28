from rest_framework import serializers
from .models import Invoice
from order.serializers import OrderSerializer
from order.models import Order
import uuid

class InvoiceSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Invoice.
    - Muestra el detalle del pedido con OrderSerializer.
    - Permite crear facturas enviando solo el order_id.
    """

    order = OrderSerializer(read_only=True)
    order_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Invoice
        fields = '__all__'

    def create(self, validated_data):
        order_id = validated_data.pop("order_id", None)

        if not order_id:
            raise serializers.ValidationError({"order_id": "Este campo es obligatorio para crear una factura."})

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            raise serializers.ValidationError({"order_id": "Pedido no encontrado."})

        if hasattr(order, "invoice"):
            raise serializers.ValidationError({"order_id": "Este pedido ya tiene factura."})

        subtotal = order.total
        impuestos = subtotal * 0.19
        total = subtotal + impuestos

        factura = Invoice.objects.create(
            order=order,
            numero_factura=str(uuid.uuid4())[:8],
            subtotal=subtotal,
            impuestos=impuestos,
            total=total,
            estado="pendiente",
        )

        return factura