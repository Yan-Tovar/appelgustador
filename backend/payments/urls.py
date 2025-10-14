from django.urls import path
from .views import create_paypal_order, capture_paypal_order

urlpatterns = [
    path("paypal/create-order/", create_paypal_order, name="create_paypal_order"),
    path("paypal/capture-order/<str:order_id>/", capture_paypal_order, name="capture_paypal_order"),
]
