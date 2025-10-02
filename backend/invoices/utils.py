from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.conf import settings
import os

def generate_invoice_pdf(invoice):
    filename = f"factura_{invoice.numero_factura}.pdf"
    filepath = os.path.join(settings.MEDIA_ROOT, "facturas", filename)

    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    c = canvas.Canvas(filepath, pagesize=letter)
    c.setFont("Helvetica", 12)

    c.drawString(100, 750, f"Factura #{invoice.numero_factura}")
    c.drawString(100, 730, f"Fecha: {invoice.fecha_emision.strftime('%d/%m/%Y')}")
    c.drawString(100, 710, f"Estado: {invoice.estado}")

    y = 680
    for item in invoice.order.items.all():
        c.drawString(100, y, f"{item.producto.nombre} x {item.quantity} = ${item.subtotal}")
        y -= 20

    c.drawString(100, y - 20, f"Subtotal: ${invoice.subtotal}")
    c.drawString(100, y - 40, f"Impuestos: ${invoice.impuestos}")
    c.drawString(100, y - 60, f"Total: ${invoice.total}")

    c.save()
    return filepath
