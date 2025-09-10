import react,  { userState } from "react";
import { registerUser } from "../services/api";

function Register () {
    const [formData, setFormData ] = userState({
        email: "",
        first_name: "",
        last_name: "",
        direccion: "",
        telefono : "",
        role: "cliente",
        password: "",
    });

    const [message,setMessage] =useState("");
    const handleChange =(e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error al registrar usuario");
      console.error(error.response?.data);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="Nombre"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Apellido"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="cliente">Cliente</option>
          <option value="empleado">Empleado</option>
          <option value="admin">Administrador</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
