import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Usuarios from "../pages/admin/Usuarios";
import Productos from "../pages/admin/Productos";
import Reportes from "../pages/admin/Reportes";
import Login from "../pages/auth/Login";
import Perfil from "../pages/Perfil";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rutas del Admin dentro del Layout */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="productos" element={<Productos />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}
