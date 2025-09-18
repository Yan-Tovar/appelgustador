from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Usuario

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # indicamos que el login será por email

    def validate(self, attrs):
        # Simple JWT ahora enviará 'email' como username_field
        # Mantenemos todo el flujo original
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['rol'] = user.rol
        token['username'] = user.username
        return token
