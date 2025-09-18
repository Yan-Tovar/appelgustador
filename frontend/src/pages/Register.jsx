import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

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
      console.error("Error completo:", error);
      if (error.response) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "Error en el servidor" });
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #EB2A05 30%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 800, width: "100%", borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Registro de Usuario
          </Typography>

          {success && <Alert severity="success">{success}</Alert>}
          {errors.general && <Alert severity="error">{errors.general}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Sección 1: Cuenta */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="text.secondary">
                  Información de la cuenta
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre de usuario"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Correo electrónico"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Contraseña"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                />
              </Grid>

              {/* Sección 2: Datos personales */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="text.secondary" mt={2}>
                  Datos personales
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={!!errors.last_name}
                  helperText={errors.last_name}
                  required
                />
              </Grid>

              {/* Sección 3: Contacto */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="text.secondary" mt={2}>
                  Información de contacto
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dirección"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  error={!!errors.direccion}
                  helperText={errors.direccion}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                  required
                />
              </Grid>

              {/* Botón */}
              <Grid item xs={12} mt={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ py: 1.2, borderRadius: 2 }}
                >
                  Registrarse
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
