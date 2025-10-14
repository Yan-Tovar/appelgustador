from django.contrib import admin
from .models import Carrusel

@admin.register(Carrusel)
class CarruselAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'estado', 'creado_en', 'link')
    list_filter = ('estado', 'creado_en')
    search_fields = ('nombre', 'descripcion')
