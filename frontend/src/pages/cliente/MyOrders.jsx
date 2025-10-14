import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { ReceiptLong } from "@mui/icons-material";

export default function MyOrders() {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

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
      Swal.fire("Error", "No se pudieron cargar los pedidos", "error");
    }
  };

  const handleGenerateInvoice = async (orderId) => {
    const confirm = await Swal.fire({
      title: "¿Generar factura?",
      text: "Se procesará el pago y se generará la factura.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2e7d32",
      cancelButtonColor: "#999",
      confirmButtonText: "Sí, generar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/invoices/facturas/${orderId}/crear/`,
        {},
        config
      );
      setSnackbar({
        open: true,
        message: `Factura generada con éxito: #${res.data.numero_factura}`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error al generar factura:", error);
      Swal.fire("Error", "No se pudo generar la factura", "error");
    }
  };

  if (orders.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">No tienes pedidos registrados</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mis Pedidos
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={6} key={order.id}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <ReceiptLong sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" fontWeight="bold">
                    Pedido #{order.id}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Fecha: {new Date(order.created_at).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estado: {order.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: ${order.total}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" fontWeight="bold">
                  Productos:
                </Typography>
                {order.items.map((item) => (
                  <Typography key={item.id} sx={{ ml: 2 }}>
                    {item.producto.nombre} x {item.quantity} = ${item.subtotal}
                  </Typography>
                ))}

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={() => handleGenerateInvoice(order.id)}
                >
                  Pagar y Generar Factura
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
