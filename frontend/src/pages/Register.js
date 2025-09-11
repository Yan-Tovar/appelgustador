import react,  { useState } from "react";
import { registerUser } from "../services/api";

function Register () {
    const [formData, setFormData ] = useState({
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
      <form onSubmit={handleSubmit} class="-c-v1">
        <br/>
        <input  
          class="-b-v2"
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br/>
        <input
          type="text"
          class="-b-v2"
          name="first_name"
          placeholder="Nombre"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <br/>
        <input
          type="text"
          class="-b-v2"
          name="last_name"
          placeholder="Apellido"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <br/>
        <input
          type="text"
          class="-b-v2"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
        />
        <br/>
        <input
          type="text"
          class="-b-v2"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
        />
        <br/>
        <select  class="-b-v2" name="role" value={formData.role} onChange={handleChange}>
          <option value="cliente">Cliente</option>
          <option value="empleado">Empleado</option>
          <option value="admin">Administrador</option>
        </select>
        <br/>
        <input
        class="-b-v2"
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br/>
        <button type="submit" class="-b-v1">Registrarse</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
