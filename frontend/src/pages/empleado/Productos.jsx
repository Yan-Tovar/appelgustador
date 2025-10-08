// src/pages/Productos.jsx
import { useEffect, useState } from "react";
import axios from "axios";
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
} from "@mui/material";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [categorias, setCategorias] = useState([]);

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/productos/productos/",
      config
    );
    setProductos(res.data);
  };

  const fetchCategorias = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/productos/categorias/",
      config
    );
    setCategorias(res.data);
  };

  const handleCrear = async () => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("precio", precio);
    formData.append("stock", stock);
    formData.append("categoria", categoria);
    if (imagen) formData.append("imagen", imagen);

    await axios.post(
      "http://127.0.0.1:8000/api/productos/productos/",
      formData,
      {
        ...config,
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      }
    );

    resetForm();
    fetchProductos();
  };

  const handleEditar = (prod) => {
    setEditingId(prod.id);
    setNombre(prod.nombre);
    setPrecio(prod.precio);
    setStock(prod.stock);
    setCategoria(prod.categoria);
    setImagen(null);
  };

  const handleActualizar = async () => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("precio", precio);
    formData.append("stock", stock);
    formData.append("categoria", categoria);
    if (imagen) formData.append("imagen", imagen);

    await axios.put(
      `http://127.0.0.1:8000/api/productos/productos/${editingId}/`,
      formData,
      {
        ...config,
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      }
    );

    resetForm();
    fetchProductos();
  };

  const handleEliminar = async (id) => {
    await axios.delete(
      `http://127.0.0.1:8000/api/productos/productos/${id}/`,
      config
    );
    fetchProductos();
  };

  const resetForm = () => {
    setEditingId(null);
    setNombre("");
    setPrecio("");
    setStock("");
    setCategoria("");
    setImagen(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Productos
      </Typography>

      {/* Formulario */}
      <Box
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}
      >
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          label="Precio"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <TextField
          label="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <TextField
          select
          label="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Selecciona categoría</MenuItem>
          {categorias.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.nombre}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="outlined" component="label">
          Subir Imagen
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />
        </Button>

        {editingId ? (
          <Button variant="contained" color="primary" onClick={handleActualizar}>
            Actualizar
          </Button>
        ) : (
          <Button variant="contained" color="success" onClick={handleCrear}>
            Crear
          </Button>
        )}
      </Box>

      {/* Lista de productos */}
      <Grid container spacing={3}>
        {productos.map((prod) => (
          <Grid item xs={12} sm={6} md={4} key={prod.id}>
            <Card>
              {prod.imagen && (
                <CardMedia
                  component="img"
                  height="140"
                  image={prod.imagen} // la API debe devolver URL absoluta o relativa servida por Django
                  alt={prod.nombre}
                />
              )}
              <CardContent>
                <Typography variant="h6">{prod.nombre}</Typography>
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
    </Box>
  );
}
