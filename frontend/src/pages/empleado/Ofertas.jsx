import { useEffect, useState } from "react";
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
} from "@mui/material";

export default function Ofertas() {
  const [offer, setOffer] = useState([]);
  const [detalle, setDetalle] = useState("");
  const [fechaFin, setFechaFin] = useState("");   // <- nueva fecha
  const [horaFin, setHoraFin] = useState("");     // <- nueva hora
  const [imagen, setImagen] = useState(null);
  const [id_producto, setProducto] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [productos, setProductos] = useState([]);

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchOffer();
    fetchProductos();
  }, []);

  const fetchOffer = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/offer/ofertas/",
      config
    );
    setOffer(res.data);
  };

  const fetchProductos = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/productos/dashboard/",
      config
    );
    setProductos(res.data);
  };

  const combinarFechaHora = (fecha, hora) => {
    if (!fecha || !hora) return "";
    return `${fecha}T${hora}`;
  };

  const handleCrear = async () => {
    const fecha_hora_fin = combinarFechaHora(fechaFin, horaFin);

    const formData = new FormData();
    formData.append("detalle", detalle);
    formData.append("fecha_hora_fin", fecha_hora_fin);
    formData.append("id_producto", id_producto);
    if (imagen) formData.append("imagen", imagen);

    await axios.post(
      "http://127.0.0.1:8000/api/offer/ofertas/",
      formData,
      {
        ...config,
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      }
    );

    resetForm();
    fetchOffer();
  };

  const handleEditar = (oferta) => {
    setEditingId(oferta.id_oferta);
    setDetalle(oferta.detalle);
    const [fecha, hora] = oferta.fecha_hora_fin.split("T");
    setFechaFin(fecha);
    setHoraFin(hora?.slice(0, 5)); // hh:mm
    setProducto(oferta.producto);
    setImagen(null);
  };

  const handleActualizar = async () => {
    const fecha_hora_fin = combinarFechaHora(fechaFin, horaFin);

    const formData = new FormData();
    formData.append("detalle", detalle);
    formData.append("fecha_hora_fin", fecha_hora_fin);
    formData.append("producto", id_producto);
    if (imagen) formData.append("imagen", imagen);

    await axios.put(
      `http://127.0.0.1:8000/api/offer/ofertas/${editingId}/`,
      formData,
      {
        ...config,
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      }
    );

    resetForm();
    fetchOffer();
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
            `http://127.0.0.1:8000/api/offer/ofertas/${id}/`,
            { estado: "inactivo" },
            config
          );
          fetchOffer();
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
    setDetalle("");
    setFechaFin("");
    setHoraFin("");
    setProducto("");
    setImagen(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ofertas
      </Typography>

      {/* Formulario */}
      <Box
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}
      >
        <TextField
          label="Detalle"
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
        />

        {/* Fecha fin */}
        <TextField
          label="Fecha Fin"
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />

        {/* Hora fin */}
        <TextField
          label="Hora Fin"
          type="time"
          value={horaFin}
          onChange={(e) => setHoraFin(e.target.value)}
        />

        {/* Producto */}
        <TextField
          select
          label="Producto"
          value={id_producto}
          onChange={(e) => setProducto(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Selecciona producto</MenuItem>
          {productos.map((prod) => (
            <MenuItem key={prod.id} value={prod.id}>
              {prod.id}
            </MenuItem>
          ))}
        </TextField>

        {/* Imagen */}
        <Button variant="outlined" component="label">
          Subir Imagen
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />
        </Button>

        {/* Botón acción */}
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

      {/* Lista de ofertas */}
      <Grid container spacing={3}>
        {offer.map((oferta) => (
          <Grid item xs={12} sm={6} md={4} key={oferta.id_oferta}>
            <Card>
              {oferta.imagen && (
                <CardMedia
                  component="img"
                  height="140"
                  image={oferta.imagen}
                  alt={oferta.nombre}
                />
              )}
              <CardContent>
                <Typography variant="h6">{oferta.detalle}</Typography>
                <Typography color="text.secondary">
                  Hora Fin: {oferta.fecha_hora_fin}
                </Typography>
                <Typography color="text.secondary">
                  Producto: {oferta.producto}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEditar(oferta)}>
                  Editar
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleEliminar(oferta.id)}
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
