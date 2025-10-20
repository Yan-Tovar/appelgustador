import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";

export default function History() {
  const theme = useTheme();
  const [historial, setHistorial] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchHistorial();
  }, []);

  const fetchHistorial = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/history/historial/",
        config
      );
      setHistorial(res.data);
    } catch (error) {
      console.error(error);
      showSnackbar("Error al cargar el historial", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Historial de Actividades
      </Typography>

      <Grid container spacing={3}>
        {historial.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Usuario: {item.usuario}
                </Typography>
                <Typography color="text.secondary">
                  Acción: {item.accion}
                </Typography>
                <Typography color="text.secondary">
                  Objeto: {item.objeto}
                </Typography>
                <Typography color="text.secondary">
                  Fecha: {new Date(item.fecha).toLocaleString()}
                </Typography>
                {item.detalle && (
                  <Typography color="text.secondary">
                    Detalle: {item.detalle}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
