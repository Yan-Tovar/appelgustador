import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Fade,
} from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/reset-password-request/", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Error al enviar solicitud");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #EB2A05 30%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
          <Card
            elevation={10}
            sx={{
              borderRadius: 4,
              backdropFilter: "blur(12px)",
              background: "rgba(255,255,255,0.9)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                align="center"
                fontWeight="bold"
                gutterBottom
                sx={{
                  color: "#EB2A05",
                  textShadow: "1px 1px 6px rgba(0,0,0,0.3)",
                }}
              >
                Recuperar Contraseña
              </Typography>
              <Typography
                variant="body2"
                align="center"
                gutterBottom
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Correo Electrónico
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {message && (
                <Alert severity="message" sx={{ mb: 2, color: "#a7a41bff" }}>
                  {message}
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Correo electrónico"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    mt: 3,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #EB2A05, #c82104)",
                    fontWeight: "bold",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(135deg, #c82104, #EB2A05)",
                    },
                  }}
                >
                  Enviar Enlace
                </Button>
              </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}