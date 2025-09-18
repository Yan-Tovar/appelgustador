import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      const userRes = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      onLogin(userRes.data);
      localStorage.setItem("user", JSON.stringify(userRes.data));

      if (userRes.data.rol === "administrador") navigate("/admin");
      else if (userRes.data.rol === "empleado") navigate("/empleado");
      else navigate("/cliente");
    } catch (err) {
      console.error("Error login:", err);
      setError("Correo o contraseña incorrectos");
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
      {/* Tarjeta con fade */}
      <Fade in={true} timeout={800}>
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
                Bienvenido
              </Typography>
              <Typography
                variant="body2"
                align="center"
                gutterBottom
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Inicia sesión para continuar
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleLogin}>
                <TextField
                  label="Correo electrónico"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <TextField
                  label="Contraseña"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  Ingresar
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Fade>
    </Box>
  );
}