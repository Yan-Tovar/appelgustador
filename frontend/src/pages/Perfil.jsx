import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Chip
} from "@mui/material";

import {
  Face as FaceIcon,

} from "@mui/icons-material";

export default function Perfil() {
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

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );

  if (!perfil) return <Typography>No se pudo cargar el perfil.</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Mi Perfil
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Usuario"
              name="username"
              value={perfil.username || ""}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              type="email"
              value={perfil.email || ""}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="first_name"
              value={perfil.first_name || ""}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="last_name"
              value={perfil.last_name || ""}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={perfil.direccion || ""}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={perfil.telefono || ""}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Box mt={2}>
          {perfil?.rol && (
            <Chip icon={<FaceIcon />} label={perfil.rol}/>
          )}
        </Box>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Guardar cambios
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
