import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";

export default function Notas() {
  const theme = useTheme();
  const [notas, setNotas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [creado_en, setCreado_en] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchNotas();
  }, []);

  const fetchNotas = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/notes/notas/",
        config
      );
      setNotas(res.data);
    } catch (error) {
      console.error(error);
      showSnackbar("Error al cargar las notas", "error");
    }
  };

  const handleCrear = async () => {
    try {
      const formData = new FormData();

      formData.append("titulo", titulo);
      formData.append("detalle", detalle);
      formData.append("creado_en", creado_en);

      await axios.post(
        "http://127.0.0.1:8000/api/notes/notas/",
        formData,
        {
          ...config,
          headers: { ...config.headers, "Content-Type": "multipart/form-data" },
        }
      );

      resetForm();
      fetchNotas();
      showSnackbar("Elemento creado correctamente", "success");
    } catch (error) {
      console.error(error);
      showSnackbar("Error al crear el elemento", "error");
    }
  };

  const handleEditar = (not) => {
    setEditingId(not.id);
    setTitulo(not.titulo);
    setDetalle(not.detalle);
    setCreado_en(not.creado_en);
  };

  const handleActualizar = async () => {
  try {
    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("detalle", detalle);
    formData.append("creado_en", creado_en);

    await axios.patch(
      `http://127.0.0.1:8000/api/notes/notas/${editingId}/`,
      formData,
      {
        ...config,
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      }
    );

    resetForm();
    fetchNotas();
    showSnackbar("Elemento actualizado correctamente", "info");
  } catch (error) {
    console.error(error);
    showSnackbar("Error al actualizar el elemento", "error");
  };


  };

  const handleEliminar = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El elemento será marcado como inactivo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `http://127.0.0.1:8000/api/notes/notas/${id}/`,
            { estado: "inactivo" },
            config
          );
          fetchNotas();
          showSnackbar("Elemento desactivado correctamente", "warning");
        } catch (error) {
          console.error(error);
          showSnackbar("Error al desactivar el elemento", "error");
        }
      }
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitulo("");
    setDetalle("");
    setCreado_en("");
  };

  const showSnackbar = (message, severity) => {
  setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
  setSnackbar({ ...snackbar, open: false });
  };

return ( 

  <Box> 
    <Typography variant="h4" gutterBottom>
      Notas 
    </Typography>

  {/* Formulario */}
  <Box
    component="form"
    onSubmit={(e) => e.preventDefault()}
    sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}
  >
    <TextField
      label="Titulo"
      value={titulo}
      onChange={(e) => setTitulo(e.target.value)}
    />
    <TextField
      label="Detalle"
      value={detalle}
      onChange={(e) => setDetalle(e.target.value)}
    />

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
  {/* Lista de notas */}
    <Grid container spacing={3}>
      {notas.map((not) => (
        <Grid item xs={12} sm={6} md={4} key={not.id}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {not.titulo}
              </Typography>
              <Typography color="text.secondary">
                Detalle: ${not.detalle}
              </Typography>
              <Typography color="text.secondary">
                Creado en: {not.creado_en}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleEditar(not)}>
                Editar
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleEliminar(not.id)}
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
    onClose={handleCloseSnackbar}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <Alert
      onClose={handleCloseSnackbar}
      severity={snackbar.severity}
      sx={{ width: "100%" }}
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
</Box>


);
}
