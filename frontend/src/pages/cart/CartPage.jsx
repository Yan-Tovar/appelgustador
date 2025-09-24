import { useEffect, useState } from "react";
import axios from "axios";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CartPage() {
  const [cart, setCart] = useState(null);

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // cargar carrito al montar
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/cart/", config);
      setCart(res.data);
    } catch (error) {
      console.error("Error al obtener carrito:", error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/cart/remove/${itemId}/`,
        config
      );
      fetchCart(); // recargar carrito
    } catch (error) {
      console.error("Error al eliminar item:", error);
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
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  };

  const calcularTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (acc, item) => acc + item.producto.precio * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    const confirmCheckout = window.confirm(
      "¿Estás seguro de confirmar tu carrito y generar la orden?"
    );
    if (!confirmCheckout) return;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/orders/create/",
        {}, // el backend no necesita más datos porque toma el carrito del usuario
        config
      );

      alert("¡Pedido creado con éxito!");
      console.log("Orden creada:", res.data);

      // limpiar carrito en frontend
      setCart({ ...cart, items: [] });
    } catch (error) {
      console.error("Error al confirmar pedido:", error);
      alert("No se pudo crear la orden, intenta nuevamente.");
    }
  };

  if (!cart) {
    return (
      <Box>
        <Typography variant="h5">Cargando carrito...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mi Carrito
      </Typography>

      <Grid container spacing={3}>
        {cart.items.length === 0 ? (
          <Typography variant="body1">Tu carrito está vacío</Typography>
        ) : (
          cart.items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{item.producto.nombre}</Typography>
                  <Typography color="text.secondary">
                    Precio: ${item.producto.precio}
                  </Typography>
                  <TextField
                    type="number"
                    label="Cantidad"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    sx={{ width: "100px", mt: 1 }}
                  />
                  <Typography sx={{ mt: 1 }}>
                    Subtotal: ${item.subtotal}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {cart.items.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Total: ${calcularTotal()}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleCheckout}
          >
            Proceder al Checkout
          </Button>
        </Box>
      )}
    </Box>
  );
}