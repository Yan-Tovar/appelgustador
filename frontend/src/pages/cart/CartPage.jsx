import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

export default function CartPage() {
  const theme = useTheme();
  const [cart, setCart] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/cart/", config);
      setCart(res.data);
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      Swal.fire("Error", "No se pudo cargar el carrito", "error");
    }
  };

  const handleDelete = async (itemId) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Se eliminará este producto del carrito.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#999",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/cart/remove/${itemId}/`, config);
      fetchCart();
      setSnackbar({ open: true, message: "Producto eliminado del carrito", severity: "info" });
    } catch (error) {
      console.error("Error al eliminar item:", error);
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/cart/update/${itemId}/`,
        { quantity: newQuantity },
        config
      );
      fetchCart();
      setSnackbar({ open: true, message: "Cantidad actualizada", severity: "success" });
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      Swal.fire("Error", "No se pudo actualizar la cantidad", "error");
    }
  };

  const calcularTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((acc, item) => acc + item.producto.precio * item.quantity, 0);
  };

  const handleCheckout = async () => {
    const confirmCheckout = await Swal.fire({
      title: "¿Confirmar pedido?",
      text: "Se generará la orden con los productos actuales.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#999",
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmCheckout.isConfirmed) return;

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/orders/create/", {}, config);
      setCart({ ...cart, items: [] });
      setSnackbar({ open: true, message: "¡Pedido creado con éxito!", severity: "success" });
    } catch (error) {
      console.error("Error al confirmar pedido:", error);
      Swal.fire("Error", "No se pudo crear la orden", "error");
    }
  };

  if (!cart) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Cargando carrito...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mi Carrito
      </Typography>

      <Grid container spacing={3}>
        {cart.items.length === 0 ? (
          <Typography variant="body1">Tu carrito está vacío</Typography>
        ) : (
          cart.items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {item.producto.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Precio: ${item.producto.precio}
                  </Typography>

                  <TextField
                    type="number"
                    label="Cantidad"
                    size="small"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                    }
                    inputProps={{ min: 1, step: 1 }}
                    sx={{ mt: 2, width: "100px" }}
                  />

                  <Typography sx={{ mt: 2 }}>
                    Subtotal: ${item.subtotal}
                  </Typography>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <IconButton color="error" onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {cart.items.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            Total: ${calcularTotal()}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCartCheckoutIcon />}
            sx={{ mt: 2 }}
            onClick={handleCheckout}
          >
            Proceder al Checkout
          </Button>
        </Box>
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