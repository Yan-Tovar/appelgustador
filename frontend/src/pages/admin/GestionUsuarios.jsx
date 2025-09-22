import { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

export default function GestionUsuarios() {
  const [Usuarios, setGestionUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

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
          <TextField
            label="Rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          {editingId ? (
            <Button variant="contained" color="warning" onClick={handleActualizar}>
              Actualizar
            </Button>
          ) : (
            <Button variant="contained" color="warning" onClick={handleActualizar}>
              Actualizar
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Listado */}
      <Grid container spacing={2}>
        {Usuarios.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{user.rol}</Typography>
                <Typography variant="h6">{user.first_name}</Typography>
                <Button
                  size="small"
                  onClick={() => handleEditar(user)}
                  color="info"
                >
                  Editar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
