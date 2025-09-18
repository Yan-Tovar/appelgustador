from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Usuario
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import PerfilUsuarioSerializer

# Registro
class RegisterView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        print(">>> Entró a RegisterView")  # 👈 debug
        serializer.save()


# Perfil del usuario autenticado
class PerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = PerfilUsuarioSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = PerfilUsuarioSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        serializer = PerfilUsuarioSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)