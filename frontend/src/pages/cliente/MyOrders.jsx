import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
} from "@mui/material";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/orders/", config);
      setOrders(res.data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  const handleGenerateInvoice = async (orderId) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/invoices/facturas/${orderId}/crear/`, // 👈 ruta corregida
        {}, // no necesitas body porque order_id ya va en la URL
        config
      );
      alert(`Factura generada con éxito: #${res.data.numero_factura}`);
    } catch (error) {
      console.error("Error al generar factura:", error);
      alert("No se pudo generar la factura");
    }
  };


  if (orders.length === 0) {
    return (
      <Box>
        <Typography variant="h5">No tienes pedidos registrados</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mis Pedidos
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">Pedido #{order.id}</Typography>
                <Typography color="text.secondary">
                  Fecha: {new Date(order.created_at).toLocaleDateString()}
                </Typography>
                <Typography color="text.secondary">
                  Estado: {order.status}
                </Typography>
                <Typography color="text.secondary">
                  Total: ${order.total}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Productos:</Typography>
                {order.items.map((item) => (
                  <Typography key={item.id} sx={{ ml: 2 }}>
                    {item.producto.nombre} x {item.quantity} = ${item.subtotal}
                  </Typography>
                ))}

                <Divider sx={{ my: 2 }} />

                {/* Botón de pagar → genera la factura */}
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleGenerateInvoice(order.id)}
                >
                  Pagar y Generar Factura
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
