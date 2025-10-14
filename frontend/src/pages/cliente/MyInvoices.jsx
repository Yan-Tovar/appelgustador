import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { PayPalButtons } from "@paypal/react-paypal-js";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SendIcon from "@mui/icons-material/Send";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export default function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const theme = useTheme();

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/invoices/facturas/", config);
      setInvoices(res.data);
    } catch (error) {
      console.error("Error al obtener facturas:", error);
      Swal.fire("Error", "No se pudieron cargar las facturas", "error");
    }
  };

  const handleSendEmail = async (invoiceId) => {
    try {
      await axios.get(`http://127.0.0.1:8000/api/invoices/facturas/${invoiceId}/enviar/`, config);
      setSnackbar({ open: true, message: "Factura enviada por correo", severity: "success" });
    } catch (error) {
      console.error("Error enviando correo:", error);
      Swal.fire("Error", "No se pudo enviar la factura", "error");
    }
  };

  if (invoices.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">No tienes facturas registradas</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mis Facturas
      </Typography>

      <Grid container spacing={3}>
        {invoices.map((invoice) => (
          <Grid item xs={12} sm={6} md={6} key={invoice.id}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                p: { xs: 2, sm: 3 },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ReceiptLongIcon sx={{ color: "primary.main" }} />
                    <Typography variant="h6" fontWeight="bold">
                      Factura #{invoice.numero_factura}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(invoice.fecha_emision).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography color="text.secondary" mb={1}>
                  Estado: {invoice.estado}
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  Pedido asociado: #{invoice.order.id}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Detalle de productos:
                </Typography>
                <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="center">Cantidad</TableCell>
                        <TableCell align="center">Precio</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoice.order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.producto_nombre}</TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="center">${item.price}</TableCell>
                          <TableCell align="right">${item.subtotal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider sx={{ my: 2 }} />

                <Box textAlign="right" mt={2} mb={2}>
                  <Typography>Subtotal: ${invoice.subtotal}</Typography>
                  <Typography>Impuestos: ${invoice.impuestos}</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    Total: ${invoice.total}
                  </Typography>
                </Box>

                {invoice.estado === "pagada" && (
                  <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={1}>
                    <Button
                      variant="outlined"
                      startIcon={<PictureAsPdfIcon />}
                      onClick={() =>
                        window.open(`http://127.0.0.1:8000/api/invoices/facturas/${invoice.id}/pdf/`)
                      }
                    >
                      Descargar PDF
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SendIcon />}
                      onClick={() => handleSendEmail(invoice.id)}
                    >
                      Enviar por correo
                    </Button>
                  </Box>
                )}

                {invoice.estado === "pendiente" && (
                  <Box mt={3}>
                    <PayPalButtons
                      style={{ layout: "horizontal" }}
                      createOrder={async () => {
                        const res = await fetch("http://127.0.0.1:8000/api/payments/paypal/create-order/", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ invoice_id: invoice.id }),
                        });

                        const data = await res.json();
                        if (!res.ok) {
                          Swal.fire("Error", "No se pudo crear la orden de PayPal", "error");
                          throw new Error(data.error || "Error creando orden");
                        }

                        return data.id;
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          const response = await fetch(
                            `http://127.0.0.1:8000/api/payments/paypal/capture-order/${data.orderID}/`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ invoice_id: invoice.id }),
                            }
                          );

                          const result = await response.json();
                          if (!response.ok) {
                            throw new Error(result.error || "Error actualizando factura");
                          }

                          setSnackbar({ open: true, message: "Pago exitoso 🎉", severity: "success" });
                          fetchInvoices(); // actualizar estado
                        } catch (err) {
                          console.error("Error procesando el pago:", err);
                          Swal.fire("Error", "No se pudo procesar el pago", "error");
                        }
                      }}
                    />
                  </Box>
                )}
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
