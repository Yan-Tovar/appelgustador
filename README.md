APP EL GUSTADOR

Este es un proyecto de Ecommerce desarrollado a la medida para la empresa El gustador


## Proyecto E-commerce – React + Django REST

Este repositorio contiene la base de un sistema de e-commerce desarrollado con:

Backend: Django + Django REST Framework

Frontend: React + Axios + React Router

Objetivo: Proveer un flujo completo de compra online con separación clara entre API y cliente web.

## Estructura base del proyecto
<img width="392" height="381" alt="image" src="https://github.com/user-attachments/assets/3096dfc0-910c-4369-8f53-b45c2217c5df" />

## Requisitos previos

Python 3.11+

Node.js 18+ y npm

Git

## Instalación

  1️. Clonar el repositorio
    git clone https://github.com/Yan-Tovar/appelgustador.git
    cd appelgustador
    
  2. Configurar el Backend (Django + DRF)
    Crear y activar entorno virtual:
      python -m venv venv
      venv\Scripts\activate     # Windows
      source venv/bin/activate  # Linux/Mac
    Instalar dependencias:
      pip install -r requirements.txt
      Si aún no tienes requirements.txt, puedes generarlo con:
      pip freeze > requirements.txt
    Aplicar migraciones y correr servidor:
      python manage.py migrate
      python manage.py runserver

    # El backend estará disponible en:
      http://127.0.0.1:8000/
      http://127.0.0.1:8000/api/  (endpoints)
      
  4. Configurar el Frontend (React)
     Entrar en la carpeta frontend/:
       cd frontend
     Instalar dependencias:
       npm install
     Iniciar servidor de desarrollo:
       npm start

     # El frontend estará disponible en:
       http://localhost:3000/
      
## Roadmap del proyecto

   Autenticación de usuarios con JWT.
  
   CRUD completo de productos.
  
   Carrito de compras persistente.
  
   Módulo de pedidos.
  
   Panel de administración (dashboard).
  
   Integración con pasarela de pagos.

## Licencia

  Este proyecto se distribuye bajo la licencia MIT.
  
