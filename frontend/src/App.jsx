import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// 'Router' envuelve toda la app para habilitar navegación por rutas.
// 'Routes' contiene todas las rutas definidas.
// 'Route' define cada ruta individual.
// 'Navigate' permite redireccionar programáticamente.

import { useState, useEffect, useMemo } from "react";
// Hooks para manejar estado local y efectos secundarios (como validar sesión).

import axios from "axios";
// Cliente HTTP para hacer peticiones al backend (por ejemplo, validar token).

// Material UI
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Importar los estilos del carrusel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


// PayPal
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Páginas y layouts
import api from "./services/api";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardAdminLayout from "./layout/DashboardAdminLayout";
import DashboardClienteLayout from "./layout/DashboardClienteLayout";
import DashboardEmpleadoLayout from "./layout/DashboardEmpleadoLayout";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DashboardEmpleado from "./pages/empleado/DashboardEmpleado";
import DashboardCliente from "./pages/cliente/DashboardCliente";
import Perfil from "./pages/Perfil";
import Productos from "./pages/empleado/Productos";
import Categorias from "./pages/empleado/Categorias";
import Carrusel from "./pages/empleado/Carrusel";
import GestionUsuarios from "./pages/admin/GestionUsuarios";
import CartPage from "./pages/cart/CartPage";
import ProductosDisponibles from "./pages/cliente/ProductosDisponibles";
import MyOrders from "./pages/cliente/MyOrders";
import MyInvoices from "./pages/cliente/MyInvoices";
import Ofertas from "./pages/empleado/Ofertas";
import Notas from "./pages/empleado/Notas";
import Historial from "./pages/admin/History";

function App() {
  // Tema global de Material UI
   const [darkMode, setDarkMode] = useState(false);

  // Crear tema dinámico
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#EB2A05" },
          secondary: { main: "#2e7d32" },
          background: {
            default: darkMode ? "#121212" : "#f4f4f4",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
          text: {
            primary: darkMode ? "#ffffff" : "#000000",
            secondary: darkMode ? "#bbbbbb" : "#555555",
          },
        },
      }),
    [darkMode]
  );

  // Estado global del usuario
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  };

  // Validar sesión activa con token
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      api
        .get("/users/me/")
        .then((res) => setUser(res.data))
        .catch(() => localStorage.clear());
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* PayPalScriptProvider envuelve TODA la app */}
      <PayPalScriptProvider options={{ "client-id": "AeeU3j2Gd6b68cD_47IIavwIIjchk9_I_3h33QBJZgBdUxGTfSIkoZiazXnwhxZJYD00EcgiVn0KRCn4" }}>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

            {/* --- Admin --- */}
            {user && user.rol === "administrador" && (
              <Route path="/admin" element={<DashboardAdminLayout onLogout={handleLogout} />}>
                <Route index element={<DashboardAdmin />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="gestionusuarios" element={<GestionUsuarios />} />
                <Route path="historial" element={<Historial />} />
              </Route>
            )}

            {/* --- Empleado --- */}
            {user && user.rol === "empleado" && (
              <Route path="/empleado" element={<DashboardEmpleadoLayout onLogout={handleLogout} />}> 
                <Route index element={<DashboardEmpleado />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="productos" element={<Productos />} />
                <Route path="categorias" element={<Categorias />} />
                <Route path="carrusel" element={<Carrusel />} />
                <Route path="ofertas" element={<Ofertas />} />
                <Route path="notas" element={<Notas />} />
              </Route>
            )}

            {/* --- Cliente --- */}
            {user && user.rol === "cliente" && (
              <Route path="/cliente" element={<DashboardClienteLayout onLogout={handleLogout} />}>
                <Route index element={<ProductosDisponibles />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="productos-disponibles" element={<ProductosDisponibles />} />
                <Route path="pedidos" element={<MyOrders />} />
                <Route path="facturas" element={<MyInvoices />} />
              </Route>
            )}

            {/* Redirecciones */}
            {user ? (
              <Route path="*" element={<Navigate to={`/${user.rol}`} replace />} />
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </Router>
      </PayPalScriptProvider>
    </ThemeProvider>
  );
}

export default App;
