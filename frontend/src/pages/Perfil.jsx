import { useEffect, useState } from "react";
import axios from "axios";

function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          alert("No se encontró token. Por favor inicia sesión.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://127.0.0.1:8000/api/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPerfil(res.data);
      } catch (err) {
        console.error("Error al cargar perfil:", err.response || err);
        alert("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.put(
        "http://127.0.0.1:8000/api/users/me/",
        perfil,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Perfil actualizado con éxito 🎉");
      setPerfil(response.data);
    } catch (error) {
      console.error("Error actualizando perfil:", error.response || error);
      alert("Error al actualizar el perfil");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!perfil) return <p>No se pudo cargar el perfil.</p>;

  return (
    <div>
      <h2>Mi Perfil</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="username"
          value={perfil.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          value={perfil.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="first_name"
          value={perfil.first_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="last_name"
          value={perfil.last_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="direccion"
          value={perfil.direccion || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="telefono"
          value={perfil.telefono || ""}
          onChange={handleChange}
        />
        <p><strong>Rol:</strong> {perfil.rol}</p>
      </form>
      <button onClick={handleUpdate}>Guardar cambios</button>
    </div>
  );
}

export default Perfil;
