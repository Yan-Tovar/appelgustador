import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
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
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";

export default function ProductosDisponibles() {
  const theme = useTheme();
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProductosDisponibles();
  }, []);

  const fetchProductosDisponibles = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/productos/disponibles/", config);
      setProductos(res.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los productos disponibles", "error");
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

  const handleAddToCart = async (productId) => {
    const cantidad = cantidades[productId] || 1;
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart/add/",
        { product_id: productId, quantity: cantidad },
        config
      );
      setSnackbar({ open: true, message: "Producto agregado al carrito", severity: "success" });
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      Swal.fire("Error", "No se pudo agregar el producto al carrito", "error");
    }
  };

  return (
    <Box sx={{ mt: 4 }}>


      {loading ? (
        <Typography variant="body1" color="textSecondary">
          Cargando productos...
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {productos.map((prod) => (
            <Grid item xs={12} sm={6} md={4} key={prod.id}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                }}
              >
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
                    Stock disponible: {prod.stock}
                  </Typography>

                  <TextField
                    type="number"
                    label="Cantidad"
                    size="small"
                    value={cantidades[prod.id] || ""}
                    onChange={(e) =>
                      handleCantidadChange(prod.id, parseInt(e.target.value) || 1)
                    }
                    inputProps={{
                      min: 1,
                      max: prod.stock,
                      step: 1,
                    }}
                    sx={{ mt: 2, width: "100px" }}
                  />
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={() => handleAddToCart(prod.id)}
                  >
                    Agregar al carrito
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
