import { useEffect, useState } from "react";
import axios from "axios";
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
} from "@mui/material";
import { PayPalButtons } from "@paypal/react-paypal-js"; // Importamos el botón de PayPal

export default function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const theme = useTheme();

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/invoices/facturas/",
        config
      );
      setInvoices(res.data);
    } catch (error) {
      console.error("Error al obtener facturas:", error);
    }
  };

  if (invoices.length === 0) {
    return (
      <Box>
        <Typography variant="h5">No tienes facturas registradas</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mis Facturas
      </Typography>

      <Grid container spacing={3}>
        {invoices.map((invoice) => (
          <Grid item xs={12} key={invoice.id}>
            <Card
              sx={{
                borderRadius: 3,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[900]
                    : theme.palette.background.paper,
                color: theme.palette.text.primary,
                p: { xs: 2, sm: 3 },
              }}
            >
              <CardContent>
                {/* Encabezado de la factura */}
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  mb={2}
                  gap={1}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Factura #{invoice.numero_factura}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fecha: {new Date(invoice.fecha_emision).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography color="text.secondary" mb={1}>
                  Estado: {invoice.estado}
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  Pedido asociado: #{invoice.order.id}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Tabla responsiva */}
                <Typography variant="subtitle1" gutterBottom>
                  Detalle de productos:
                </Typography>
                <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                  <Table size="small" aria-label="detalle productos">
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

                {/* Totales */}
                <Box textAlign={{ xs: "left", sm: "right" }} mt={2} mb={2}>
                  <Typography>Subtotal: ${invoice.subtotal}</Typography>
                  <Typography>Impuestos: ${invoice.impuestos}</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    Total: ${invoice.total}
                  </Typography>
                </Box>

                {/* Botones de acción */}
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={1}
                >
                  <Button
                    variant="outlined"
                    onClick={() =>
                      window.open(
                        `http://127.0.0.1:8000/api/invoices/facturas/${invoice.id}/pdf/`
                      )
                    }
                  >
                    Descargar PDF
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      try {
                        await axios.get(
                          `http://127.0.0.1:8000/api/invoices/facturas/${invoice.id}/enviar/`,
                          config
                        );
                        alert("Factura enviada por correo al cliente");
                      } catch (error) {
                        console.error("Error enviando correo:", error);
                        alert("No se pudo enviar la factura");
                      }
                    }}
                  >
                    Enviar por correo
                  </Button>
                </Box>

                {/* Botón de pagar con PayPal */}
                {invoice.estado === "pendiente" && (
                  <Box mt={2}>
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
                        console.log("Orden creada:", data);

                        if (!res.ok) {
                          alert("Error creando la orden de PayPal");
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

                          let result = null;
                          try {
                            result = await response.json();
                          } catch {
                            result = { error: "Respuesta vacía o inválida del servidor" };
                          }

                          console.log("Resultado captura:", result);

                          if (!response.ok) {
                            throw new Error(result.error || "Error actualizando factura");
                          }

                          alert("Pago exitoso 🎉");
                        } catch (err) {
                          console.error("Error procesando el pago:", err);
                          alert("Error procesando el pago: " + err.message);
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
    </Box>
  );
}
