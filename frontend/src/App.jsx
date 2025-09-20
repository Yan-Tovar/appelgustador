import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// 'Router' envuelve toda la app para habilitar navegación por rutas.
// 'Routes' contiene todas las rutas definidas.
// 'Route' define cada ruta individual.
// 'Navigate' permite redireccionar programáticamente.

import { useState, useEffect } from "react";
// Hooks para manejar estado local y efectos secundarios (como validar sesión).

import axios from "axios";
// Cliente HTTP para hacer peticiones al backend (por ejemplo, validar token).

// Imports de Material UI
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
// 'ThemeProvider' aplica un tema global.
// 'createTheme' permite definir colores y modo.
// 'CssBaseline' normaliza estilos base en todos los navegadores.

// Importar las páginas desde /pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DashboardEmpleado from "./pages/DashboardEmpleado";
import DashboardCliente from "./pages/DashboardCliente";
import Perfil from "./pages/Perfil";
import Productos from "./pages/admin/Productos";
import Categorias from "./pages/admin/Categorias";
// Importa todas las vistas que se renderizan según la ruta.
// Algunas están dentro de layouts, otras son independientes.

function App() {
  // Tema global de Material UI
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: { main: "#1976d2" }, // azul
      secondary: { main: "#9c27b0" }, // púrpura
    },
  });

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
      axios
        .get("http://127.0.0.1:8000/api/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.clear());
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Página inicial pública */}
          <Route path="/" element={<Home />} />

          {/* Páginas públicas */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleLogin} />} />

          {/* --- Rutas protegidas --- */}
          {user && user.rol === "administrador" && (
            <Route path="/admin" element={<DashboardLayout onLogout={handleLogout} />}>
              {/* aquí van las vistas hijas dentro del layout */}
              <Route index element={<DashboardAdmin />} />
              <Route path="productos" element={<Productos />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="perfil" element={<Perfil />} />
            </Route>
          )}

          {user && user.rol === "empleado" && (
            <Route path="/empleado" element={<DashboardEmpleado onLogout={handleLogout} />} />
          )}

          {user && user.rol === "cliente" && (
            <Route path="/cliente" element={<DashboardCliente onLogout={handleLogout} />} />
          )}

          {/* Redirecciones por rol */}
          {user ? (
            <Route path="*" element={<Navigate to={`/${user.rol}`} replace />} />
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
