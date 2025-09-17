import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";


// Importar las páginas desde /pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardEmpleado from "./pages/DashboardEmpleado";
import DashboardCliente from "./pages/DashboardCliente"; 
import Perfil from "./pages/Perfil";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";

function App() {
  // Estado para usuario (en producción usaremos JWT/localStorage)
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
  });


  // Función para manejar login/registro
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Función para cerrar sesión
   const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(() => localStorage.clear());
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Página inicial pública */}
        <Route path="/" element={<Home />} />

        {/* Páginas públicas */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleLogin} />} />

        {/* Dashboards según el rol */}
        {user && user.rol === "administrador" && (
          <Route path="/admin" element={<DashboardAdmin onLogout={handleLogout} />} />
        )}

        {user && user.rol === "empleado" && (
          <Route path="/empleado" element={<DashboardEmpleado onLogout={handleLogout} />} />
        )}

        {user && user.rol === "cliente" && (
          <Route path="/cliente" element={<DashboardCliente onLogout={handleLogout} />} />
        )}

        {/* Gestión de categorías y productos */}
        {user && (user.rol === "administrador" || user.rol === "empleado") && (
          <>
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/productos" element={<Productos />} />
          </>
        )}

        {/* Perfil (para todos los usuarios logueados) */}
        {user && <Route path="/perfil" element={<Perfil />} />}

        {/* Redirección automática */}
        {user ? (
          <Route path="*" element={<Navigate to={`/${user.rol}`} replace />} />
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
