# Importamos decoradores y utilidades de Django REST Framework
from rest_framework.decorators import api_view, permission_classes  # Para definir vistas basadas en funciones y asignar permisos
from rest_framework.permissions import IsAuthenticated             # Para requerir que el usuario esté autenticado
from rest_framework.response import Response                       # Para enviar respuestas HTTP en formato JSON
from rest_framework import status                                  # Para usar códigos de estado HTTP

# Importamos los modelos del carrito
from cart.models import Cart, CartItem

# Importamos los modelos del pedido
from .models import Order, OrderItem

# Importamos el serializer del pedido para devolverlo en la respuesta
from .serializers import OrderSerializer


# -----------------------------
# Vista 1: Listar órdenes de un usuario
# -----------------------------
@api_view(["GET"])  # Solo permite GET
@permission_classes([IsAuthenticated])  # Requiere autenticación
def list_user_orders(request):
    user = request.user
    orders = Order.objects.filter(user=user).order_by("-created_at")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# -----------------------------
# Vista 2: Crear orden a partir del carrito
# -----------------------------
@api_view(["POST"])  # Solo permite POST
@permission_classes([IsAuthenticated])  # Requiere autenticación
def create_order_from_cart(request):
    user = request.user

    try:
        cart = Cart.objects.get(user=user)
    except Cart.DoesNotExist:
        return Response({"error": "No tienes carrito"}, status=status.HTTP_404_NOT_FOUND)

    if not cart.items.exists():
        return Response({"error": "El carrito está vacío"}, status=status.HTTP_400_BAD_REQUEST)

    # Crear el pedido vacío
    order = Order.objects.create(user=user, status="pending", total=0)

    total = 0
    for item in cart.items.all():
        order_item = OrderItem.objects.create(
            order=order,
            producto=item.producto,
            quantity=item.quantity,
            price=item.producto.precio
        )
        total += order_item.subtotal

    order.total = total
    order.save()

    # Vaciar carrito
    cart.items.all().delete()

    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)