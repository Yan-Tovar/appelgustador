from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("username", "email", "role", "phone", "is_active", "is_staff")
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("username", "email", "phone")

    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("role", "address", "phone", "pdf_document")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ("role", "address", "phone", "pdf_document")}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
