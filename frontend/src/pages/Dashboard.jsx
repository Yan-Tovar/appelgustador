import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  useTheme,
  Container,
} from "@mui/material";

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    fetchProductosDisponibles();
  }, []);

  const fetchProductosDisponibles = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/productos/dashboard/");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos disponibles:", error);
      setError("Error al obtener productos disponibles. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCantidadChange = (productId, value) => {
    const cantidad = Math.max(1, Math.min(value, productos.find((prod) => prod.id === productId)?.stock || 1));
    setCantidades((prev) => ({
      ...prev,
      [productId]: cantidad,
    }));
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            El Gustador
          </Typography>
          <Button color="inherit" onClick={() => handleNavigate("/home")}>
            Inicio
          </Button>
          <Button color="inherit" onClick={() => handleNavigate("/login")}>
            Iniciar sesión
          </Button>
          <Button color="inherit" onClick={() => handleNavigate("/register")}>
            Registrarse
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Container sx={{ py: 5 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Bienvenido a El Gustador
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Descubre nuestros productos destacados y únete a la experiencia. Puedes iniciar sesión o registrarte para comenzar.
        </Typography>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Productos */}
        {loading ? (
          <Typography variant="body1" color="text.secondary">
            Cargando productos...
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {productos.map((prod) => (
              <Grid item xs={12} sm={6} md={4} key={prod.id}>
                <Card elevation={4} sx={{ borderRadius: 3 }}>
                  {prod.imagen && (
                    <CardMedia
                      component="img"
                      height="160"
                      image={prod.imagen}
                      alt={prod.nombre}
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {prod.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Precio: ${prod.precio}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock: {prod.stock}
                    </Typography>

                    <TextField
                      type="number"
                      label="Cantidad"
                      size="small"
                      value={cantidades[prod.id] || ""}
                      onChange={(e) =>
                        handleCantidadChange(prod.id, parseInt(e.target.value) || 1)
                      }
                      inputProps={{ min: 1, max: prod.stock, step: 1 }}
                      sx={{ mt: 2, width: "100px" }}
                    />
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleNavigate("/home")}
                    >
                      Ir al inicio
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 5,
          py: 3,
          textAlign: "center",
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} El Gustador. Todos los derechos reservados.
        </Typography>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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
