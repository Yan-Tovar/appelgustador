// src/pages/Productos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Paper,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import {
  Category as CategoryIcon,
  MonetizationOn as PriceIcon,
  Inventory2 as StockIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

export default function Productos() {
  const theme = useTheme();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    imagen: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchCategorias();
    fetchProductos();
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

  const fetchProductos = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/productos/productos/",
        config
      );
      setProductos(res.data);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  const resetForm = () =>
    setForm({ nombre: "", categoria: "", precio: "", stock: "", imagen: null });

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (e) =>
    setForm(prev => ({ ...prev, imagen: e.target.files[0] }));

  const handleCrear = async () => {
    const confirm = await Swal.fire({
      title: "¿Crear producto?",
      text: "Se añadirá un nuevo producto.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const data = new FormData();
      data.append("nombre", form.nombre);
      data.append("categoria", form.categoria);
      data.append("precio", form.precio);
      data.append("stock", form.stock);
      if (form.imagen) data.append("imagen", form.imagen);

      await axios.post(
        "http://127.0.0.1:8000/api/productos/productos/",
        data,
        { ...config, headers: { ...config.headers, "Content-Type": "multipart/form-data" } }
      );

      setSnackbar({ open: true, message: "Producto creado 🎉", severity: "success" });
      resetForm();
      fetchProductos();
    } catch (err) {
      Swal.fire("Error", "No se pudo crear el producto", "error");
    }
  };

  const handleEditar = prod => {
    setEditingId(prod.id);
    setForm({
      nombre: prod.nombre,
      categoria: prod.categoria,
      precio: prod.precio,
      stock: prod.stock,
      imagen: null,
    });
  };

  const handleActualizar = async () => {
    const confirm = await Swal.fire({
      title: "¿Actualizar producto?",
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
      data.append("categoria", form.categoria);
      data.append("precio", form.precio);
      data.append("stock", form.stock);
      if (form.imagen) data.append("imagen", form.imagen);

      await axios.put(
        `http://127.0.0.1:8000/api/productos/productos/${editingId}/`,
        data,
        { ...config, headers: { ...config.headers, "Content-Type": "multipart/form-data" } }
      );

      setSnackbar({ open: true, message: "Producto actualizado ✅", severity: "success" });
      setEditingId(null);
      resetForm();
      fetchProductos();
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar el producto", "error");
    }
  };

  const handleEliminar = async id => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/productos/productos/${id}/`,
        config
      );
      setSnackbar({ open: true, message: "Producto eliminado 🗑️", severity: "info" });
      fetchProductos();
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Gestión de Productos
      </Typography>

      {/* Formulario dividido en 3 tarjetas */}
      <Grid container spacing={3} alignItems="stretch" sx={{ mb: 4 }}>
        {/* Sección 1: Información */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: "100%", borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <CategoryIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Información</Typography>
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
              select
              label="Categoría"
              name="categoria"
              fullWidth
              value={form.categoria}
              onChange={handleChange}
            >
              <MenuItem value="">Selecciona categoría</MenuItem>
              {categorias.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Paper>
        </Grid>

        {/* Sección 2: Inventario */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: "100%", borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <PriceIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Inventario</Typography>
            </Box>
            <TextField
              label="Precio"
              name="precio"
              type="number"
              fullWidth
              value={form.precio}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              fullWidth
              value={form.stock}
              onChange={handleChange}
            />
          </Paper>
        </Grid>

        {/* Sección 3: Imagen y acción */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: "100%", borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <ImageIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Imagen</Typography>
            </Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<StockIcon />}
              sx={{ mb: 2 }}
            >
              Subir imagen
              <input hidden type="file" accept="image/*" onChange={handleFile} />
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

      {/* Lista de productos */}
      <Grid container spacing={3}>
        {productos.map(prod => (
          <Grid item xs={12} sm={6} md={4} key={prod.id}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              {prod.imagen && (
                <CardMedia
                  component="img"
                  height="140"
                  image={prod.imagen}
                  alt={prod.nombre}
                />
              )}
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {prod.nombre}
                </Typography>
                <Typography color="text.secondary">
                  Precio: ${prod.precio}
                </Typography>
                <Typography color="text.secondary">
                  Stock: {prod.stock}
                </Typography>
                <Typography color="text.secondary">
                  Categoría: {prod.categoria}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEditar(prod)}>
                  Editar
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleEliminar(prod.id)}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
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
