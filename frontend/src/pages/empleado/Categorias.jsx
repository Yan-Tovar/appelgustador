// src/pages/Categorias.jsx
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

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchCategorias();
  }, []);

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
    formData.append("descripcion", descripcion);
    if (imagen) formData.append("imagen", imagen);

    await axios.post(
      "http://127.0.0.1:8000/api/productos/categorias/",
      formData,
      {
        ...config,
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      }
    );

    resetForm();
    fetchCategorias();
  };

  const handleEditar = (cat) => {
    setEditingId(cat.id);
    setNombre(cat.nombre);
    setDescripcion(cat.descripcion);
    setImagen(null); // No traemos archivo, solo se cambia si el usuario sube otro
  };

  const handleActualizar = async () => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    if (imagen) formData.append("imagen", imagen);

    await axios.put(
      `http://127.0.0.1:8000/api/productos/categorias/${editingId}/`,
      formData,
      {
        ...config,
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      }
    );

    resetForm();
    fetchCategorias();
  };

  const handleEliminar = async (id) => {
    await axios.delete(
      `http://127.0.0.1:8000/api/productos/categorias/${id}/`,
      config
    );
    fetchCategorias();
  };

  const resetForm = () => {
    setEditingId(null);
    setNombre("");
    setDescripcion("");
    setImagen(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Categorías
      </Typography>

      {/* Formulario */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          {editingId ? (
            <Button variant="contained" color="warning" onClick={handleActualizar}>
              Actualizar
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleCrear}>
              Crear
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Listado */}
      <Grid container spacing={2}>
        {categorias.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{cat.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {cat.descripcion}
                </Typography>
                <Button
                  size="small"
                  onClick={() => handleEditar(cat)}
                  color="info"
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  onClick={() => handleEliminar(cat.id)}
                  color="error"
                >
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}