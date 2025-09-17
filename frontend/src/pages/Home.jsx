import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* Logo */}
      <img
        src="/logo.png"   // ← public/logo.png
        alt="Appelgustador Logo"
        style={{ width: "200px", marginBottom: "20px" }}
      />

      <h1>Bienvenido a Appelgustador</h1>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/login")}
          style={{ marginRight: "10px", padding: "10px 20px" }}
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => navigate("/register")}
          style={{ padding: "10px 20px" }}
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}