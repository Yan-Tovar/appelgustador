from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Invoice
from .serializers import InvoiceSerializer
from order.models import Order
from decimal import Decimal   

import uuid

from django.http import FileResponse, JsonResponse
from django.core.mail import EmailMessage
from django.conf import settings
from .utils import generate_invoice_pdf

from django.shortcuts import render
from django.db.models import Q
from rest_framework.views import APIView

class BuscarFacturas(APIView):
    def get(self, request):
        query = request.query_params.get('q', '').strip()

        if not query:
            return Response({"error": "Debe proporcionar un parámetro de búsqueda (q)."}, status=status.HTTP_400_BAD_REQUEST)

        invoices = Invoice.objects.filter(
            Q(numero_factura__icontains=query) |
            Q(fecha_emision__icontains=query) |
            Q(total__icontains=query)   |
            Q(estado__icontains=query)  
        ).distinct()

        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

def download_invoice_pdf(request, invoice_id):
    invoice = Invoice.objects.get(id=invoice_id)
    filepath = generate_invoice_pdf(invoice)
    return FileResponse(open(filepath, "rb"), as_attachment=True, filename=f"factura_{invoice.numero_factura}.pdf")

def send_invoice_email(request, invoice_id):
    invoice = Invoice.objects.get(id=invoice_id)
    filepath = generate_invoice_pdf(invoice)

    email = EmailMessage(
        subject=f"Factura #{invoice.numero_factura}",
        body="Adjunto encontrarás tu factura.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[invoice.order.user.email],  
    )
    email.attach_file(filepath)
    email.send()

    return JsonResponse({"message": "Factura enviada correctamente al cliente"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_invoice(request, order_id):
    user = request.user

    try:
        order = Order.objects.get(id=order_id, user=user)
    except Order.DoesNotExist:
        return Response({"error": "Pedido no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    # Si ya existe factura, retornarla
    if hasattr(order, "invoice"):
        serializer = InvoiceSerializer(order.invoice)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Usamos Decimal para cálculos financieros
    subtotal = order.total
    impuestos = subtotal * Decimal("0.19")   # IVA 19% como Decimal
    total = subtotal + impuestos

    factura = Invoice.objects.create(
        order=order,
        numero_factura=str(uuid.uuid4())[:8],  # Generamos número único corto
        subtotal=subtotal,
        impuestos=impuestos,
        total=total,
        estado="pendiente",
    )

    serializer = InvoiceSerializer(factura)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_invoices(request):
    user = request.user
    invoices = Invoice.objects.filter(order__user=user).order_by("-fecha_emision")
    serializer = InvoiceSerializer(invoices, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lista_facturas(request):
    invoices = Invoice.objects.order_by("-fecha_emision")
    serializer = InvoiceSerializer(invoices, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
