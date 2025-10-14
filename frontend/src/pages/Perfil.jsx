import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Chip,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  Face as FaceIcon,
  AccountCircle,
  Email,
  Person,
  Home,
  Phone,
} from "@mui/icons-material";

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          Swal.fire("Error", "No se encontró token. Por favor inicia sesión.", "error");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://127.0.0.1:8000/api/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPerfil(res.data);
      } catch (err) {
        console.error("Error al cargar perfil:", err.response || err);
        Swal.fire("Error", "No se pudo cargar el perfil", "error");
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
    const confirm = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "Se actualizará tu información de perfil.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#EB2A05",
      cancelButtonColor: "#999",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("access");
      const response = await axios.put(
        "http://127.0.0.1:8000/api/users/me/",
        perfil,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPerfil(response.data);
      setSnackbar({ open: true, message: "Perfil actualizado con éxito", severity: "success" });
    } catch (error) {
      console.error("Error actualizando perfil:", error.response || error);
      setSnackbar({ open: true, message: "Error al actualizar el perfil", severity: "error" });
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );

  if (!perfil) return <Typography>No se pudo cargar el perfil.</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mi Perfil
      </Typography>

      <Grid container spacing={3}>
        {/* Datos de cuenta */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <AccountCircle sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Datos de cuenta</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="Usuario"
              name="username"
              value={perfil.username || ""}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              type="email"
              value={perfil.email || ""}
              onChange={handleChange}
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* Información personal */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Person sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Información personal</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="Nombre"
              name="first_name"
              value={perfil.first_name || ""}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Apellido"
              name="last_name"
              value={perfil.last_name || ""}
              onChange={handleChange}
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* Información de contacto */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Home sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">Contacto</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={perfil.direccion || ""}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={perfil.telefono || ""}
              onChange={handleChange}
              variant="outlined"
            />
          </Paper>
        </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Encabezado */}
              <Box display="flex" alignItems="center" mb={2}>
                <FaceIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6" fontWeight="bold">
                  Rol
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Contenido */}
              <Box mb={2}>
                <Chip
                  icon={<FaceIcon />}
                  label={`Rol: ${perfil.rol}`}
                  color="secondary"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>

              {/* Enlace */}
              <Box textAlign="center">
                <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      color: "#0e37eeff",
                      fontWeight: 500,
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    ¿Quieres cambiar tu contraseña?
                  </Typography>
                </Link>
              </Box>
            </Paper>
          </Grid>
      </Grid>

      {/* Botón */}
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Guardar cambios
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
