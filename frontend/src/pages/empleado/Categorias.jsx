// src/pages/Categorias.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import {
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

export default function Categorias() {
  const theme = useTheme();
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    imagen: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/productos/categorias/",
        config
      );
      setCategorias(res.data);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar las categorías", "error");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ nombre: "", descripcion: "", imagen: null });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    setForm((prev) => ({ ...prev, imagen: e.target.files[0] }));
  };

  const handleCrear = async () => {
    const confirm = await Swal.fire({
      title: "¿Crear categoría?",
      text: "Se añadirá una nueva categoría.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const data = new FormData();
      data.append("nombre", form.nombre);
      data.append("descripcion", form.descripcion);
      if (form.imagen) data.append("imagen", form.imagen);

      await axios.post(
        "http://127.0.0.1:8000/api/productos/categorias/",
        data,
        {
          ...config,
          headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSnackbar({
        open: true,
        message: "Categoría creada 🎉",
        severity: "success",
      });
      resetForm();
      fetchCategorias();
    } catch (err) {
      Swal.fire("Error", "No se pudo crear la categoría", "error");
    }
  };

  const handleEditar = (cat) => {
    setEditingId(cat.id);
    setForm({
      nombre: cat.nombre,
      descripcion: cat.descripcion,
      imagen: null,
    });
  };

  const handleActualizar = async () => {
    const confirm = await Swal.fire({
      title: "¿Actualizar categoría?",
      text: "Se guardarán los cambios.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const data = new FormData();
      data.append("nombre", form.nombre);
      data.append("descripcion", form.descripcion);
      if (form.imagen) data.append("imagen", form.imagen);

      await axios.put(
        `http://127.0.0.1:8000/api/productos/categorias/${editingId}/`,
        data,
        {
          ...config,
          headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSnackbar({
        open: true,
        message: "Categoría actualizada ",
        severity: "success",
      });
      resetForm();
      fetchCategorias();
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar la categoría", "error");
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/productos/categorias/${id}/`,
        config
      );
      setSnackbar({
        open: true,
        message: "Categoría eliminada ",
        severity: "info",
      });
      fetchCategorias();
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar la categoría", "error");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Gestión de Categorías
      </Typography>

      {/* Formulario en 2 tarjetas cuadradas */}
      <Grid container spacing={3} alignItems="stretch" sx={{ mb: 4 }}>
        {/* Sección 1: Datos */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <CategoryIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Datos</Typography>
            </Box>
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              value={form.nombre}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Descripción"
              name="descripcion"
              fullWidth
              multiline
              rows={3}
              value={form.descripcion}
              onChange={handleChange}
            />
          </Paper>
        </Grid>

        {/* Sección 2: Imagen y acciones */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <ImageIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Imagen</Typography>
            </Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              sx={{ mb: 3 }}
            >
              Subir imagen
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleFile}
              />
            </Button>

            <Box mt="auto" display="flex" justifyContent="space-between">
              {editingId ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleActualizar}
                >
                  Actualizar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCrear}
                >
                  Crear
                </Button>
              )}
              <Button variant="outlined" onClick={resetForm}>
                Limpiar
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de categorías */}
      <Grid container spacing={3}>
        {categorias.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.id}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <CardContent>
                {cat.imagen && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={cat.imagen}
                    alt={cat.nombre}
                  />
                )}
                <Typography variant="h6" fontWeight="bold">
                  {cat.nombre}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {cat.descripcion}
                </Typography>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleEditar(cat)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleEliminar(cat.id)}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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
