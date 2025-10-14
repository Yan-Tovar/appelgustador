import { useEffect, useState } from "react";
import Slider from "react-slick";
import Swal from "sweetalert2";
import axios from "axios";
import {
Box,
Typography,
TextField,
Button,
Grid,
Snackbar,
Alert,
} from "@mui/material";

export default function Carrusel() {
const [carrusel, setCarrusel] = useState([]);
const [nombre, setNombre] = useState("");
const [descripcion, setDescripcion] = useState("");
const [imagen, setImagen] = useState(null);
const [link, setLink] = useState("");
const [editingId, setEditingId] = useState(null);

const [snackbar, setSnackbar] = useState({
open: false,
message: "",
severity: "success",
});

const token = localStorage.getItem("access");
const config = { headers: { Authorization: `Bearer ${token}` } };

useEffect(() => {
fetchCarrusel();
}, []);

const fetchCarrusel = async () => {
try {
const res = await axios.get(
"http://127.0.0.1:8000/api/carrousel/carrusel/",
config
);
setCarrusel(res.data);
} catch (error) {
console.error(error);
showSnackbar("Error al cargar el carrusel", "error");
}
};

const handleCrear = async () => {
try {
const formData = new FormData();
formData.append("nombre", nombre);
formData.append("descripcion", descripcion);
formData.append("link", link);
if (imagen) formData.append("imagen", imagen);


  await axios.post(
    "http://127.0.0.1:8000/api/carrousel/carrusel/",
    formData,
    {
      ...config,
      headers: { ...config.headers, "Content-Type": "multipart/form-data" },
    }
  );

  resetForm();
  fetchCarrusel();
  showSnackbar("Elemento creado correctamente", "success");
} catch (error) {
  console.error(error);
  showSnackbar("Error al crear el elemento", "error");
}


};

const handleEditar = (carr) => {
setEditingId(carr.id);
setNombre(carr.nombre);
setDescripcion(carr.descripcion);
setLink(carr.link);
setImagen(null);
};

const handleActualizar = async () => {
try {
const formData = new FormData();
formData.append("nombre", nombre);
formData.append("descripcion", descripcion);
formData.append("link", link);
if (imagen) formData.append("imagen", imagen);


  await axios.patch(
    `http://127.0.0.1:8000/api/carrousel/carrusel/${editingId}/`,
    formData,
    {
      ...config,
      headers: { ...config.headers, "Content-Type": "multipart/form-data" },
    }
  );

  resetForm();
  fetchCarrusel();
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
`http://127.0.0.1:8000/api/carrousel/carrusel/${id}/`,
{ estado: "inactivo" },
config
);
fetchCarrusel();
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
setNombre("");
setDescripcion("");
setLink("");
setImagen(null);
};

const showSnackbar = (message, severity) => {
setSnackbar({ open: true, message, severity });
};

const handleCloseSnackbar = () => {
setSnackbar({ ...snackbar, open: false });
};

return ( <Box> <Typography variant="h4" gutterBottom>
Carrusel </Typography>


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
      label="Descripción"
      value={descripcion}
      onChange={(e) => setDescripcion(e.target.value)}
    />
    <TextField
      label="Link (opcional)"
      value={link}
      onChange={(e) => setLink(e.target.value)}
      sx={{ minWidth: 300 }}
    />

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

  {/* Carrusel de imágenes */}
  <Grid item xs={12} sm={12} md={12}>
    <Box sx={{ width: "100%", mt: 4 }}>
      <Slider
        dots
        infinite
        speed={600}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay
        autoplaySpeed={4000}
        arrows
        adaptiveHeight
      >
        {carrusel.map((carr) => (
          <Box
            key={carr.id}
            sx={{
              position: "relative",
              textAlign: "center",
              color: "white",
            }}
          >
            <Box
              component="img"
              src={carr.imagen}
              alt={carr.nombre}
              sx={{
                width: "100%",
                height: { xs: 300, md: 500 },
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0,0,0,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                {carr.nombre}
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 600 }}>
                {carr.descripcion}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditar(carr)}
                  sx={{ mr: 1 }}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleEliminar(carr.id)}
                  sx={{ mr: 1 }}
                >
                  Eliminar
                </Button>
                <a
                  href={carr.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                  >
                    url
                  </Button>
                </a>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
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
