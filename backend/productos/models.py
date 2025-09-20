# Este archivo define los modelos de base de datos para la app 'productos'.
# Cada clase representa una tabla en la base de datos.
# Django usa estos modelos para crear, consultar y modificar registros relacionados con categorías y productos.

from django.db import models
# Importa el módulo de modelos de Django, necesario para definir clases que representen tablas en la base de datos.

class Categoria(models.Model):
    # Representa una categoría de productos (ej. Puras, Procesados, Deshidratados).
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    ]
    # Define las opciones disponibles para el campo 'estado'. Se usa para activar o desactivar la categoría.

    nombre = models.CharField(max_length=100, unique=True)
    # Nombre de la categoría. Debe ser único para evitar duplicados.

    imagen = models.ImageField(upload_to='categorias/', blank=True, null=True)
    # Imagen representativa de la categoría. Se guarda en la carpeta 'media/categorias/'.

    descripcion = models.TextField(blank=True)
    # Descripción opcional de la categoría.

    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='activo')
    # Estado actual de la categoría. Puede ser 'activo' o 'inactivo'. Por defecto es 'activo'.

    def __str__(self):
        return self.nombre
    # Define cómo se mostrará la categoría en el panel de administración o en el shell. Retorna el nombre.


class Producto(models.Model):
    # Representa un producto individual dentro de una categoría (ej. Canela, Comino, Color).
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    ]
    # Opciones para el estado del producto. Igual que en la categoría.

    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos')
    # Relación con la categoría a la que pertenece el producto.
    # Si se elimina la categoría, se eliminan todos sus productos (CASCADE).
    # 'related_name' permite acceder a los productos desde una categoría: categoria.productos.all()

    nombre = models.CharField(max_length=150)
    # Nombre del producto.

    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    # Imagen del producto. Se guarda en 'media/productos/'.

    descripcion = models.TextField(blank=True)
    # Descripción opcional del producto.

    precio = models.DecimalField(max_digits=10, decimal_places=2)
    # Precio del producto. Usa decimales para mayor precisión (hasta 99999999.99).

    stock = models.PositiveIntegerField()
    # Cantidad disponible en inventario. Solo acepta números positivos.

    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='activo')
    # Estado del producto. Puede estar activo o inactivo.

    ingredientes = models.TextField(blank=True)
    # Lista de ingredientes del producto. Útil para mostrar en la ficha técnica.

    instrucciones_conservacion = models.TextField(blank=True)
    # Indicaciones para conservar el producto (ej. refrigerar, mantener en lugar seco).

    instrucciones_uso = models.TextField(blank=True)
    # Indicaciones para consumir o preparar el producto (ej. calentar antes de servir).

    def __str__(self):
        return self.nombre
    # Muestra el nombre del producto cuando se imprime o se visualiza en el admin.

#Flujo de datos

    # Cuando el frontend hace una petición a /api/productos/, Django consulta este modelo.

    # El modelo define cómo se estructura la información en la base de datos.

    # Los datos se serializan (con serializers.py) y se envían al frontend en formato JSON.

    # El frontend los muestra en tarjetas, listas o fichas de producto.