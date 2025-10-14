// src/pages/Ofertas.jsx
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Swal from "sweetalert2";
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
  Paper,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocalOffer as OfferIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

export default function Ofertas() {
  const theme = useTheme();
  const [offers, setOffers] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    detalle: "",
    fechaFin: "",
    horaFin: "",
    id_producto: "",
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
    fetchOffers();
    fetchProductos();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/offer/ofertas/", config);
      setOffers(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las ofertas", "error");
    }
  };

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/productos/dashboard/", config);
      setProductos(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ detalle: "", fechaFin: "", horaFin: "", id_producto: "", imagen: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = e => {
    setForm(prev => ({ ...prev, imagen: e.target.files[0] }));
  };

  const combine = () => form.fechaFin && form.horaFin ? `${form.fechaFin}T${form.horaFin}` : "";

  const handleCreate = async () => {
    const confirm = await Swal.fire({
      title: "¿Crear oferta?",
      text: "Se añadirá una nueva oferta.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const data = new FormData();
      data.append("detalle", form.detalle);
      data.append("fecha_hora_fin", combine());
      data.append("id_producto", form.id_producto);
      if (form.imagen) data.append("imagen", form.imagen);

      await axios.post("http://127.0.0.1:8000/api/offer/ofertas/", data, {
        ...config,
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      });

      setSnackbar({ open: true, message: "Oferta creada 🎉", severity: "success" });
      resetForm();
      fetchOffers();
    } catch {
      Swal.fire("Error", "No se pudo crear la oferta", "error");
    }
  };

  const handleEdit = off => {
    const [fecha, hora] = off.fecha_hora_fin.split("T");
    setEditingId(off.id_oferta);
    setForm({
      detalle: off.detalle,
      fechaFin: fecha,
      horaFin: hora?.slice(0,5) || "",
      id_producto: off.id_producto,
      imagen: null
    });
  };

  const handleUpdate = async () => {
    const confirm = await Swal.fire({
      title: "¿Actualizar oferta?",
      text: "Se guardarán los cambios.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const data = new FormData();
      data.append("detalle", form.detalle);
      data.append("fecha_hora_fin", combine());
      data.append("id_producto", form.id_producto);
      if (form.imagen) data.append("imagen", form.imagen);

      await axios.put(`http://127.0.0.1:8000/api/offer/ofertas/${editingId}/`, data, {
        ...config,
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      });

      setSnackbar({ open: true, message: "Oferta actualizada ✅", severity: "success" });
      resetForm();
      fetchOffers();
    } catch {
      Swal.fire("Error", "No se pudo actualizar la oferta", "error");
    }
  };

  const handleDelete = async id => {
    const result = await Swal.fire({
      title: "¿Desactivar oferta?",
      text: "La oferta quedará inactiva.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.patch(`http://127.0.0.1:8000/api/offer/ofertas/${id}/`, { estado: "inactivo" }, config);
      setSnackbar({ open: true, message: "Oferta desactivada", severity: "warning" });
      fetchOffers();
    } catch {
      setSnackbar({ open: true, message: "Error al desactivar", severity: "error" });
    }
  };

  return (
    <Box sx={{ p:3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Gestión de Ofertas
      </Typography>

      {/* Formulario en 3 tarjetas cuadradas */}
      <Grid container spacing={3} alignItems="stretch" sx={{ mb:4 }}>
        {/* Detalle */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p:2, borderRadius:2, height:"100%" }}>
            <Box display="flex" alignItems="center" mb={2}>
              <OfferIcon color="primary" sx={{mr:1}}/>
              <Typography variant="h6">Detalle</Typography>
            </Box>
            <TextField
              label="Detalle"
              name="detalle"
              fullWidth
              multiline
              rows={3}
              value={form.detalle}
              onChange={handleChange}
            />
          </Paper>
        </Grid>

        {/* Fecha y hora */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p:2, borderRadius:2, height:"100%" }}>
            <Box display="flex" alignItems="center" mb={2}>
              <EventIcon color="primary" sx={{mr:1}}/>
              <Typography variant="h6">Fecha y Hora Fin</Typography>
            </Box>
            <TextField
              label="Fecha Fin"
              name="fechaFin"
              type="date"
              fullWidth
              value={form.fechaFin}
              onChange={handleChange}
              sx={{ mb:2 }}
            />
            <TextField
              label="Hora Fin"
              name="horaFin"
              type="time"
              fullWidth
              value={form.horaFin}
              onChange={handleChange}
            />
          </Paper>
        </Grid>

        {/* Producto e imagen y acción */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p:2, borderRadius:2, height:"100%", display:"flex", flexDirection:"column" }}>
            <Box display="flex" alignItems="center" mb={2}>
              <DescriptionIcon color="primary" sx={{mr:1}}/>
              <Typography variant="h6">Producto & Imagen</Typography>
            </Box>
            <TextField
              select
              label="Producto"
              name="id_producto"
              fullWidth
              value={form.id_producto}
              onChange={handleChange}
              sx={{ mb:2 }}
            >
              <MenuItem value="">Selecciona producto</MenuItem>
              {productos.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
              ))}
            </TextField>
            <Button variant="outlined" component="label" startIcon={<ImageIcon/>} sx={{ mb:2 }}>
              Subir Imagen
              <input hidden type="file" accept="image/*" onChange={handleFile}/>
            </Button>
            <Box mt="auto" display="flex" justifyContent="space-between">
              {editingId ? (
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                  Actualizar
                </Button>
              ) : (
                <Button variant="contained" color="success" onClick={handleCreate}>
                  Crear
                </Button>
              )}
              <Button variant="outlined" onClick={resetForm}>Limpiar</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de ofertas */}
      <Grid container spacing={3}>
        {offers.map(off=>(
          <Grid item xs={12} sm={6} md={4} key={off.id_oferta}>
            <Card elevation={3} sx={{borderRadius:2}}>
              {off.imagen && (
                <CardMedia component="img" height="140" image={off.imagen} alt={off.detalle}/>
              )}
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{off.detalle}</Typography>
                <Typography color="text.secondary">Fin: {off.fecha_hora_fin}</Typography>
                <Typography color="text.secondary">Producto ID: {off.id_producto}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={()=>handleEdit(off)}>Editar</Button>
                <Button size="small" color="error" onClick={()=>handleDelete(off.id_oferta)}>Eliminar</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={()=>setSnackbar(prev=>({ ...prev, open:false }))}
        anchorOrigin={{vertical:"bottom", horizontal:"center"}}
      >
        <Alert onClose={()=>setSnackbar(prev=>({ ...prev, open:false}))} severity={snackbar.severity} variant="filled" sx={{width:"100%"}}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
