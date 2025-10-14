import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
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

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/users/reset-password/${uid}/${token}/`,
        { password }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirige al login después de 2s
    } catch (err) {
      setError(err.response?.data?.error || "Error al cambiar contraseña");
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
                Restablecer Contraseña
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
                  label="Nueva Contraseña"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <TextField
                  label="Confirmar Contraseña"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Cambiar Contraseña
                </Button>
              </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}