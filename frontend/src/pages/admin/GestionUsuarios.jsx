import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function GestionUsuarios() {
  const theme = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [rol, setRol] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users/gestionusuarios/", config);
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    }
  };

  const handleEditar = (user) => {
    setEditingId(user.id);
    setRol(user.rol);
  };

  const handleActualizar = async () => {
    const confirm = await Swal.fire({
      title: "¿Cambiar rol?",
      text: "Se actualizará el rol del usuario seleccionado.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f57c00",
      cancelButtonColor: "#999",
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const formData = new FormData();
      formData.append("rol", rol);

      await axios.put(
        `http://127.0.0.1:8000/api/users/gestionusuarios/${editingId}/`,
        formData,
        {
          ...config,
          headers: { ...config.headers, "Content-Type": "multipart/form-data" },
        }
      );

      setSnackbar({ open: true, message: "Rol actualizado con éxito", severity: "success" });
      resetForm();
      fetchUsuarios();
    } catch (error) {
      console.error("Error actualizando rol:", error);
      Swal.fire("Error", "No se pudo actualizar el rol", "error");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setRol("");
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Gestión de Usuarios
      </Typography>

      {/* Formulario de edición */}
      {editingId && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <InputLabel id="rol-label">Rol</InputLabel>
            <Select
              labelId="rol-label"
              fullWidth
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            >
              <MenuItem value="administrador">Administrador</MenuItem>
              <MenuItem value="empleado">Empleado</MenuItem>
              <MenuItem value="cliente">Cliente</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="warning" onClick={handleActualizar}>
              Confirmar cambio de rol
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="outlined" onClick={resetForm}>
              Cancelar edición
            </Button>
          </Grid>
        </Grid>
      )}

      {/* Listado de usuarios */}
      <Grid container spacing={3}>
        {usuarios.map((user) => (
          <Grid item xs={12} sm={6} md={6} key={user.id}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: 120,
                }}
              >
                <Avatar
                  alt={`${user.first_name} ${user.last_name}`}
                  src="/FotoPerfil.png"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />

                <Stack spacing={0.5} flex={1} minWidth={0}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {`${user.first_name} ${user.last_name}`}
                  </Typography>
                  <Typography variant="body2" color="text.primary" noWrap>
                    Rol: {user.rol}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                </Stack>

                <IconButton
                  edge="end"
                  aria-label="editar"
                  onClick={() => handleEditar(user)}
                  color="info"
                >
                  <EditIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
