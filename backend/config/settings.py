from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
# Define la ruta base del proyecto. Se usa para construir rutas relativas (como MEDIA_ROOT o STATICFILES_DIRS).


SECRET_KEY = 'django-insecure-a&h&(097^+#n!j$#ku*u=j-r(#gw)gp4!fvh=s-3xh1jlwxei1'
# Clave secreta usada para cifrar sesiones, tokens y otros elementos sensibles. Nunca debe compartirse en producción.

DEBUG = True
# Activa el modo de desarrollo. Muestra errores detallados en el navegador. Debe estar en False en producción.

ALLOWED_HOSTS = []
# Lista de dominios o IPs permitidas para acceder al proyecto. En producción se debe incluir el dominio real.


# Application definition

INSTALLED_APPS = [
    'corsheaders',                     # Permite peticiones desde otros dominios (como React en localhost).
    'rest_framework',                  # Framework para construir APIs REST.
    'users',                           # App personalizada para gestión de usuarios.
    'productos',                       # App personalizada para productos.
    'cart',                            # App personalizada para Carrito.
    'django.contrib.admin',           # Panel de administración.
    'django.contrib.auth',            # Sistema de autenticación.
    'django.contrib.contenttypes',    # Manejo de tipos de contenido.
    'django.contrib.sessions',        # Manejo de sesiones.
    'django.contrib.messages',        # Sistema de mensajes.
    'django.contrib.staticfiles',     # Manejo de archivos estáticos (CSS, JS, etc.).
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',               # Permite que el frontend (React) se comunique con el backend.
    'django.middleware.security.SecurityMiddleware',       # Seguridad básica (cabeceras, etc.).
    'django.contrib.sessions.middleware.SessionMiddleware',# Manejo de sesiones.
    'django.middleware.common.CommonMiddleware',           # Funciones comunes como redirecciones.
    'django.middleware.csrf.CsrfViewMiddleware',           # Protección contra ataques CSRF.
    'django.contrib.auth.middleware.AuthenticationMiddleware', # Verifica si el usuario está autenticado.
    'django.contrib.messages.middleware.MessageMiddleware',    # Manejo de mensajes entre vistas y plantillas.
    'django.middleware.clickjacking.XFrameOptionsMiddleware',  # Previene ataques de clickjacking.
]

ROOT_URLCONF = 'config.urls'
# Define el archivo principal de rutas del proyecto. Aquí se conectan las apps con sus URLs.

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # Puedes agregar rutas personalizadas si usas plantillas HTML.
        'APP_DIRS': True,  # Busca plantillas dentro de cada app.
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',  # Permite acceder a la request en las plantillas.
                'django.contrib.auth.context_processors.auth', # Agrega el usuario autenticado al contexto.
                'django.contrib.messages.context_processors.messages', # Agrega mensajes al contexto.
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
# Punto de entrada para servidores web como Gunicorn. No necesitas modificarlo en desarrollo.


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # Motor de base de datos (PostgreSQL en este caso).
        'NAME': 'appelgustador',                    # Nombre de la base de datos.
        'USER': 'postgres',                         # Usuario de la base de datos.
        'PASSWORD': 'admin12345',                   # Contraseña del usuario.
        'HOST': 'localhost',                        # Dirección del servidor de BD.
        'PORT': '5432',                             # Puerto de PostgreSQL.
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
# Validadores que se aplican al crear o cambiar contraseñas. Mejoran la seguridad.

# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us' # Idioma por defecto.

TIME_ZONE = 'America/Bogota' # Zona horaria. 'America/Bogota' en Colombia.

USE_I18N = True # Habilita la internacionalización.

USE_TZ = True # Usa zonas horarias.


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/' # Ruta para servir archivos estáticos (CSS, JS, etc.).
MEDIA_URL = '/media/' # Ruta pública para acceder a archivos subidos por usuarios.
MEDIA_ROOT = BASE_DIR / 'media' # Carpeta donde se guardan los archivos subidos.

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# Tipo de campo por defecto para claves primarias. Evita warnings en modelos.

REST_FRAMEWORK = {
  'DEFAULT_AUTHENTICATION_CLASSES': (
    'rest_framework_simplejwt.authentication.JWTAuthentication',
  ),
}
# Configura DRF para usar JWT como sistema de autenticación por defecto.

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
# Permite que el frontend (React) se comunique con el backend desde estos dominios.

AUTH_USER_MODEL = "users.Usuario"
# Define el modelo de usuario personalizado que estás usando en tu app 'users'.

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "yantovar2007@gmail.com"
EMAIL_HOST_PASSWORD = "akbd aqft pwfb dawb"