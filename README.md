# 🛍️ App El Gustador

**App El Gustador** es una aplicación web desarrollada para gestionar el flujo completo de compras en línea de la empresa **El Gustador**.

La plataforma permite a los usuarios:

- Visualizar productos disponibles
- Realizar pedidos en línea
- Consultar facturas
- Efectuar pagos desde la misma aplicación

El sistema gestiona el acceso y las funcionalidades según tres roles definidos:

- 🧑 **Cliente**: compra productos y gestiona sus pedidos
- 👩‍💼 **Empleado**: gestiona pedidos y atención al cliente
- 👨‍💼 **Administrador**: administra usuarios, productos, facturación y estadísticas generales

---

## 🚀 Tecnologías utilizadas

- ⚛️ **React** – desarrollo del frontend
- 🐍 **Django** – backend principal
- 🔗 **Django REST Framework** – API RESTful
- 🎨 **Material UI** – interfaz de usuario moderna

---

## 🛠️ Instalación

> Asegúrate de tener instalados **Python 3**, **Node.js** y **npm**.

### 🔧 Clonar el repositorio

```bash
git https://github.com/Yan-Tovar/appelgustador.git
cd app-el-gustador



Backend (Django )
cd backend
python -m venv env
source env/bin/activate  # En Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


Frontend (React)
cd frontend
npm install
npm start


Funcionalidades principales

🛍️ Catálogo de productos con filtros y búsqueda

🧾 Consulta y descarga de facturas

💳 Realización de pagos en línea

📦 Gestión de pedidos

👤 Administración de usuarios según su rol

📊 Panel administrativo con reportes


Licencia
Este proyecto no cuenta con una licencia abierta. Todos los derechos reservados.


Equipo de desarrollo
Desarrollado por el equipo Winsoft Y&C
