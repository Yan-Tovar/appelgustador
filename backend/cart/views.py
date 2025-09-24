from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from productos.models import Producto


def get_user_cart(user):
    cart, created = Cart.objects.get_or_create(user=user)
    return cart


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = get_user_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart = get_user_cart(request.user)
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity", 1)

        try:
            producto = Producto.objects.get(id=product_id)
        except Producto.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, producto=producto)
        if not created:
            cart_item.quantity += int(quantity)
        else:
            cart_item.quantity = int(quantity)
        cart_item.save()

        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)


class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "Item no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.quantity = request.data.get("quantity", cart_item.quantity)
        cart_item.save()
        return Response(CartItemSerializer(cart_item).data)


class RemoveCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "Item no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()
        return Response({"message": "Item eliminado"}, status=status.HTTP_204_NO_CONTENT)