import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    direccion: "",
    telefono: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/register/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Usuario registrado exitosamente");
      console.log(response.data);
    } catch (error) {
        console.error(" Error completo:", error);

        if (error.response) {
          console.error("Error response data:", error.response.data);
          setErrors(error.response.data);
        } else {
          setErrors({ general: "Error en el servidor" });
        }
      }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
          required
        />
        {errors.username && <p>{errors.username}</p>}

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p>{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p>{errors.password}</p>}

        <input
          type="text"
          name="first_name"
          placeholder="Nombre"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        {errors.first_name && <p>{errors.first_name}</p>}

        <input
          type="text"
          name="last_name"
          placeholder="Apellido"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        {errors.last_name && <p>{errors.last_name}</p>}

        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
          required
        />
        {errors.direccion && <p>{errors.direccion}</p>}

        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
        {errors.telefono && <p>{errors.telefono}</p>}

        <button type="submit">Registrarse</button>
      </form>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
    </div>
  );
};

export default Register;
