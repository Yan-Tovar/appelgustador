from django.contrib import admin
from .models import Notes

@admin.register(Notes)
class NotesAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo', 'detalle', 'creado_en', 'estado')
    list_filter = ('estado', 'creado_en')
    search_fields = ('titulo', 'descripcion')
