from django.urls import path
from .views import create_invoice, list_invoices
from .views import download_invoice_pdf, send_invoice_email

urlpatterns = [
    path("facturas/", list_invoices, name="list_invoices"),
    path("facturas/<int:order_id>/crear/", create_invoice, name="create_invoice"),
    path("facturas/<int:invoice_id>/pdf/", download_invoice_pdf, name="download_invoice_pdf"),
    path("facturas/<int:invoice_id>/enviar/", send_invoice_email, name="send_invoice_email"),
]
