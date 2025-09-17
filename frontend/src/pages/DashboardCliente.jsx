import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function DashboardCliente({ onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();           // Limpiamos estado y tokens
    navigate("/login");   // Redirigimos al login
  };

  return (
    <div>
      <h1>Dashboard Cliente</h1>
      <button onClick={handleLogoutClick}>Cerrar sesión</button>

      {/* Aquí puedes poner links a perfil, productos, etc */}
      <Link to="/perfil">
        <button>Ver/Editar Perfil</button>
      </Link>
    </div>
  );
}
