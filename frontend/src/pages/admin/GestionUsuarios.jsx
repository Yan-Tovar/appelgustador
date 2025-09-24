import { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  List,
  ListItem,
  Divider,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function GestionUsuarios() {
  const [Usuarios, setGestionUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const [confirmOpen, setConfirmOpen] = useState(false);

   const handleOpenConfirm = () => {
    const audio = new Audio("/logout.mp3"); // debe estar en /public
    audio.play(); // Reproduce sonido 
    setConfirmOpen(true); // Abre el diálogo de confirmación
  };

  // Fetch usuarios
  useEffect(() => {
    fetchGestionUsuarios();
  }, []);

  const fetchGestionUsuarios = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/users/gestionusuarios/",
      config
    );
    setGestionUsuarios(res.data);
  };

  // Manejar la edición de usuario
  const handleEditar = (user) => {
    setEditingId(user.id);
    setRol(user.rol);
  };

  // Actualizar rol
  const handleActualizar = async () => {
    const formData = new FormData();
    formData.append("rol", rol);
    await axios.put(
      `http://127.0.0.1:8000/api/users/gestionusuarios/${editingId}/`,
      formData,
      {
        ...config,
        headers: { ...config.headers, "Content-Type": "multipart/form-data"},
      }
    );

    resetForm();
    fetchGestionUsuarios();
  };

  // Limpiar formulario
  const resetForm = () => {
    setEditingId(null);
    setRol("");
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Gestion Usuarios
      </Typography>

      {/* Formulario */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
            <InputLabel id="rol-label">Rol</InputLabel>
            <Select
              labelId="rol-label"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            >
              <MenuItem value="administrador">Administrador</MenuItem>
              <MenuItem value="empleado">Empleado</MenuItem>
              <MenuItem value="cliente">Cliente</MenuItem>
            </Select>
        </Grid>
        <Grid item xs={12}>
          {/* Confirmación de cambio de Rol */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
              <DialogTitle>¿Seguro que quieres cambiar este rol?</DialogTitle>
              <DialogActions>
                <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                {editingId ? (
                  <Button 
                    onClick={() => {handleActualizar();setConfirmOpen(false);}}
                    color="error"
                  >
                    Confirmar
                  </Button>
                ) : (
                  <Button variant="contained" color="warning" onClick={() => {handleActualizar();setConfirmOpen(false);}}>
                    Confirmar
                  </Button>
                )}
              </DialogActions>
            </Dialog>
      
            <Button variant="contained" color="warning" onClick={handleOpenConfirm}>
              Actualizar
            </Button>
        </Grid>
      </Grid>

      {/* Listado */}
      <Grid container spacing={2}>
        {Usuarios.map((user) => (
          <Grid item xs={12} sm={6} md={6} lg={6} key={user.id}>
            <Card
              sx={{
                height: "100%", // hace que todas las cards ocupen el mismo alto posible
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: 120, // asegura un alto mínimo consistente
                }}
              >
                {/* Avatar */}
                <Avatar
                  alt={`${user.first_name} ${user.last_name}`}
                  src="/FotoPerfil.png"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />

                {/* Info del usuario */}
                <Stack spacing={0.5} flex={1} minWidth={0}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    noWrap
                  >
                    {`${user.first_name} ${user.last_name}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    noWrap
                  >
                    Rol: {user.rol}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                  >
                    {user.email}
                  </Typography>
                </Stack>

                {/* Botón editar */}
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
    </div>
  );
}
