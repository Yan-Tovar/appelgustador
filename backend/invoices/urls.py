from django.urls import path
from .views import create_invoice, list_invoices, lista_facturas, BuscarFacturas
from .views import download_invoice_pdf, send_invoice_email

urlpatterns = [
    path("facturas/", list_invoices, name="list_invoices"),
    path("listarfacturas/", lista_facturas, name="listar_facturas"),
    path("facturas/<int:order_id>/crear/", create_invoice, name="create_invoice"),
    path("facturas/<int:invoice_id>/pdf/", download_invoice_pdf, name="download_invoice_pdf"),
    path("facturas/<int:invoice_id>/enviar/", send_invoice_email, name="send_invoice_email"),
    path("buscar/", BuscarFacturas.as_view(), name='buscar_facturas'),
]
