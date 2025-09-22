# Este archivo define serializers para el modelo Usuario.
# Permite registrar nuevos usuarios y editar su perfil desde el frontend.
# También valida que el email no esté duplicado y configura el rol por defecto.

from rest_framework import serializers
# Importa el módulo de serializers de Django REST Framework.

from .models import Usuario
# Importa el modelo de usuario personalizado que se usará como base para los serializers.

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    # Serializer para consultar y actualizar el perfil de un usuario autenticado.
    # Se usa en vistas tipo GET y PUT/PATCH para mostrar o modificar datos del usuario.

    class Meta:
        model = Usuario
        # Indica que el serializer se basa en el modelo Usuario.

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
        # Lista de campos que se incluirán en la respuesta JSON.

        read_only_fields = ["rol", "id"]
        # Campos que no pueden ser modificados por el usuario desde el frontend.

    def update(self, instance, validated_data):
        # Método que se ejecuta al actualizar el perfil del usuario.

        # Si viene email, validamos que no esté repetido en otro usuario
        email = validated_data.get("email", instance.email)
        if Usuario.objects.exclude(pk=instance.pk).filter(email=email).exists():
            raise serializers.ValidationError({"email": "Este correo ya está registrado."})
        # Verifica que el nuevo email no esté en uso por otro usuario distinto al actual.

        return super().update(instance, validated_data)
        # Si todo está bien, actualiza el usuario con los datos validados.

class RegisterSerializer(serializers.ModelSerializer):
    # Serializer para registrar nuevos usuarios desde el frontend.
    # Se usa en vistas tipo POST para crear una cuenta.

    class Meta:
        model = Usuario
        # Indica que el serializer se basa en el modelo Usuario.

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
        # Campos que se recibirán desde el frontend para crear el usuario.

        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'password': {'write_only': True, 'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'direccion': {'required': True},
            'telefono': {'required': True},
        }
        # Configura cada campo: algunos son obligatorios, y el password no se devuelve en la respuesta (write_only).

    def validate_email(self, value):
        # Valida que el email no esté registrado previamente.
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo ya está registrado.")
        return value

    def create(self, validated_data):
        # Método que se ejecuta al crear un nuevo usuario.

        # Creamos el usuario sin rol explícito
        user = Usuario.objects.create_user(**validated_data)
        # Usa el método create_user para que la contraseña se guarde correctamente (encriptada).

        # Por defecto lo ponemos como cliente
        user.rol = 'cliente'
        user.save()
        # Asigna el rol 'cliente' por defecto y guarda el usuario.

        return user
        # Devuelve el nuevo usuario creado.

class UsuarioSerializer(serializers.ModelSerializer):
    # Define un serializer automático para el modelo Usuario.
    # ModelSerializer crea los campos automáticamente basándose en el modelo.

    class Meta:
        model = Usuario
        # Indica que este serializer se basa en el modelo Usuario.

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
        # Incluye todos los campos del modelo en el serializer.
        # Esto permite enviar y recibir todos los datos de un usuario (nombre, imagen, estado, etc.).

# ¿Cómo se usa en el flujo?

    # El frontend envía una petición POST /api/users/register/ → se usa RegisterSerializer.

    # El backend valida los datos, crea el usuario y responde con su información.

    # El frontend hace una petición GET /api/users/me/ o PUT /api/users/me/ → se usa PerfilUsuarioSerializer.

    # El backend devuelve o actualiza los datos del usuario autenticado.
