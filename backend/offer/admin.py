from django.contrib import admin
from .models import Offer

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('id_oferta', 'id_producto', 'estado', 'fecha_hora_inicio', 'fecha_hora_fin')
    search_fields = ('id_producto__nombre', 'detalle') 
    list_filter = ('fecha_hora_inicio', 'fecha_hora_fin')
    ordering = ('-fecha_hora_inicio',)
