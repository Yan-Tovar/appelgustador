from rest_framework import serializers
from .models import Usuario

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "direccion",
            "telefono",
            "rol",
        ]
        read_only_fields = ["rol", "id"]

    def update(self, instance, validated_data):
        # Si viene email, validamos que no esté repetido en otro usuario
        email = validated_data.get("email", instance.email)
        if Usuario.objects.exclude(pk=instance.pk).filter(email=email).exists():
            raise serializers.ValidationError({"email": "Este correo ya está registrado."})

        return super().update(instance, validated_data)

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id',
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'direccion',
            'telefono'
        ]
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'password': {'write_only': True, 'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'direccion': {'required': True},
            'telefono': {'required': True},
        }

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo ya está registrado.")
        return value

    def create(self, validated_data):
        # Creamos el usuario sin rol explícito
        user = Usuario.objects.create_user(**validated_data)
        # Por defecto lo ponemos como cliente
        user.rol = 'cliente'
        user.save()
        return user
