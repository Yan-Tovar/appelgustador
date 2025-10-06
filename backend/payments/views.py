from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import requests
from .paypal import get_paypal_access_token, PAYPAL_API_BASE
from invoices.models import Invoice
from invoices.utils import generate_invoice_pdf  # si la usas más adelante

# ----------------------------------------------------------------------
# CREAR ORDEN PAYPAL
# ----------------------------------------------------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_paypal_order(request):
    """
    Crea una orden en PayPal a partir de una factura pendiente.
    Retorna el ID de la orden para que el frontend inicie el flujo de pago.
    """
    invoice_id = request.data.get("invoice_id")
    if not invoice_id:
        return Response({"error": "invoice_id es requerido"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        invoice = Invoice.objects.get(id=invoice_id, estado="pendiente")
    except Invoice.DoesNotExist:
        return Response({"error": "Factura no encontrada o ya pagada"}, status=status.HTTP_404_NOT_FOUND)

    try:
        access_token = get_paypal_access_token()
    except requests.exceptions.RequestException as e:
        return Response({"error": "Error obteniendo token de PayPal", "detalle": str(e)}, status=502)

    url = f"{PAYPAL_API_BASE}/v2/checkout/orders"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    data = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": str(invoice.total)
                },
                "description": f"Factura #{invoice.numero_factura}",
            }
        ],
    }

    response = requests.post(url, json=data, headers=headers)

    try:
        response_data = response.json()
    except ValueError:
        return Response({"error": "Respuesta inválida de PayPal", "raw": response.text}, status=502)

    if response.status_code != 201:
        return Response(
            {"error": "Falló la creación de la orden en PayPal", "paypal_response": response_data},
            status=response.status_code,
        )

    return Response(
        {
            "success": True,
            "message": "Orden PayPal creada correctamente",
            "id": response_data.get("id"),
            "paypal_order": response_data,
        },
        status=201,
    )


# ----------------------------------------------------------------------
# CAPTURAR ORDEN PAYPAL
# ----------------------------------------------------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def capture_paypal_order(request, order_id):
    """
    Captura una orden PayPal previamente creada y marca la factura como pagada.
    """
    invoice_id = request.data.get("invoice_id")
    if not invoice_id:
        return Response({"error": "invoice_id es requerido"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        invoice = Invoice.objects.get(id=invoice_id, estado="pendiente")
    except Invoice.DoesNotExist:
        return Response({"error": "Factura no encontrada o ya pagada"}, status=status.HTTP_404_NOT_FOUND)

    try:
        access_token = get_paypal_access_token()
    except requests.exceptions.RequestException as e:
        return Response({"error": "Error obteniendo token de PayPal", "detalle": str(e)}, status=502)

    url = f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    try:
        response = requests.post(url, headers=headers)
    except requests.exceptions.RequestException as e:
        return Response({"error": "Error de comunicación con PayPal", "detalle": str(e)}, status=502)

    try:
        capture_data = response.json()
    except ValueError:
        return Response(
            {"error": "PayPal devolvió una respuesta no válida", "raw": response.text},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    # Si PayPal devuelve un error
    if response.status_code not in (200, 201):
        return Response(
            {"error": "Fallo en la captura PayPal", "paypal_response": capture_data},
            status=response.status_code,
        )

    # Procesar solo si COMPLETED
    print("🧩 CAPTURE DATA:", capture_data)
    if capture_data.get("status") == "COMPLETED":
        invoice.estado = "pagada"
        invoice.save()

        return Response(
            {
                "success": True,
                "message": "Pago completado y factura actualizada",
                "invoice_id": invoice.id,
                "paypal_order": capture_data,
            },
            status=status.HTTP_200_OK,
        )

    # Si PayPal no completó el pago
    return Response(
        {
            "success": False,
            "error": "El pago no fue completado",
            "paypal_order": capture_data,
        },
        status=status.HTTP_422_UNPROCESSABLE_ENTITY,
    )
