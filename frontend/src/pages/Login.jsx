import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ onLogin }) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Solicitud al backend para obtener token
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Obtener datos del usuario
      const userRes = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      // Guardar usuario en estado global
      onLogin(userRes.data); 
      localStorage.setItem("user", JSON.stringify(userRes.data));


      // Redirigir según rol
      if (userRes.data.rol === "administrador") navigate("/admin");
      else if (userRes.data.rol === "empleado") navigate("/empleado");
      else navigate("/cliente");

    } catch (err) {
      console.error("Error login:", err);
      alert("Correo o contraseña incorrectos");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Ingresar</button>
    </form>
  );
}
