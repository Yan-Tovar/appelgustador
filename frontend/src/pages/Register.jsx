import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Fade,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AccountCircleOutlined,
  EmailOutlined,
  LockOutlined,
  PersonOutlined,
  ContactPhoneOutlined,
  HomeOutlined,
} from "@mui/icons-material";

export default function Register() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    direccion: "",
    telefono: "",
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [showContent, setShowContent] = useState(true);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await axios.post("http://127.0.0.1:8000/api/users/register/", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setSnackbar({ open: true, message: "Registro exitoso 🎉", severity: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setSnackbar({ open: true, message: "Error en el servidor", severity: "error" });
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #EB2A05 20%, #ffffff 90%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decoración */}
      <Box
        component="img"
        src="/littleStars.png"
        alt="Estrellas"
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          width: { xs: 60, md: 160 },
          opacity: 0.8,
        }}
      />
      <Box
        component="img"
        src="/littleStars.png"
        alt="Estrellas"
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          width: { xs: 200, md: 360 },
          opacity: 0.8,
        }}
      />

      {/* Contenido */}
      <Fade in={showContent} timeout={800}>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "white", textShadow: "2px 2px 8px rgba(0,0,0,0.4)" }}
          >
            Crea tu cuenta
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Grid container spacing={3} alignItems="stretch">
              {/* Sección: Cuenta */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <AccountCircleOutlined color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Información de cuenta
                    </Typography>
                  </Box>
                  <TextField
                    label="Usuario"
                    name="username"
                    fullWidth
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Contraseña"
                    name="password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Paper>
              </Grid>

              {/* Sección: Personal */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <PersonOutlined color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Datos personales
                    </Typography>
                  </Box>
                  <TextField
                    label="Nombre"
                    name="first_name"
                    fullWidth
                    value={formData.first_name}
                    onChange={handleChange}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Apellido"
                    name="last_name"
                    fullWidth
                    value={formData.last_name}
                    onChange={handleChange}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                  />
                </Paper>
              </Grid>

              {/* Sección: Contacto */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <HomeOutlined color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Dirección
                    </Typography>
                  </Box>
                  <TextField
                    label="Dirección"
                    name="direccion"
                    fullWidth
                    value={formData.direccion}
                    onChange={handleChange}
                    error={!!errors.direccion}
                    helperText={errors.direccion}
                    sx={{ mb: 2 }}
                  />
                  <Box display="flex" alignItems="center" mb={2}>
                    <ContactPhoneOutlined color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Contacto
                    </Typography>
                  </Box>
                  <TextField
                    label="Teléfono"
                    name="telefono"
                    fullWidth
                    value={formData.telefono}
                    onChange={handleChange}
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                  />
                </Paper>
              </Grid>
            </Grid>

            {/* Botón de registro */}
            <Box textAlign="center" mt={4}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #EB2A05, #c82104)",
                  color: "white",
                  fontWeight: "bold",
                  boxShadow: "0px 4px 15px rgba(235,42,5,0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #c82104, #EB2A05)",
                  },
                }}
              >
                Registrarse
              </Button>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  ¿Ya estás registrado?
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/Login")}
                  sx={{
                    mt: 1,
                    borderColor: "#EB2A05",
                    color: "#EB2A05",
                    fontWeight: "bold",
                    "&:hover": {
                      borderColor: "#c82104",
                      color: "#c82104",
                      background: "rgba(235, 42, 5, 0.1)",
                    },
                  }}
                >
                  Iniciar Sesion
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Fade>


      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: "#111",
          color: "white",
          textAlign: "center",
          mt: "10vh",
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: "40px",
            background:
              "radial-gradient(circle at 50% 0%, rgba(235,42,5,0.7), transparent 70%)",
            filter: "blur(10px)",
          }}
        />
        <Container sx={{ py: 4 }}>
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            © 2025 Appelgustador. Todos los derechos reservados.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "#EB2A05" }}>
            Dirección: Calle 123 #45-67, Bogotá, Colombia | Tel: +57 300 123 4567
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "white" }}>
            contacto@appelgustador.com
          </Typography>
        </Container>
      </Box>

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
