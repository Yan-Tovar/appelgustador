import { Link } from "react-router-dom";

function App() {
  return (
    <main style={{ textAlign: "center", padding: "40px" }}>
      <h1>Bienvenido a Mi Ecommerce</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
        <Link to="/register">
          <button>Registrarse</button>
        </Link>
        <Link to="/login">
          <button>Iniciar Sesión</button>
        </Link>
      </div>
    </main>
  );
}

export default App;
