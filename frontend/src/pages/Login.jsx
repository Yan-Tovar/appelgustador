import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Fade,
  Alert,
  Snackbar,
} from "@mui/material";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

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

      onLogin?.(userRes.data);
      localStorage.setItem("user", JSON.stringify(userRes.data));

      setSnackbar({ open: true, message: "Inicio de sesión exitoso", severity: "success" });

      setTimeout(() => {
        if (userRes.data.rol === "administrador") navigate("/admin");
        else if (userRes.data.rol === "empleado") navigate("/empleado");
        else navigate("/cliente");
      }, 1000);
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
        flexDirection: "column",
        background: "linear-gradient(135deg, #EB2A05 20%, #ffffff 90%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Estrellitas decorativas */}
      <Box
        component="img"
        src="/littleStars.png"
        alt="Estrellitas"
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: { xs: "80px", md: "200px" },
          opacity: 0.9,
        }}
      />
      <Box
        component="img"
        src="/littleStars.png"
        alt="Estrellitas"
        sx={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          width: { xs: "400px", md: "500px" },
          opacity: 0.9,
        }}
      />

      {/* Contenido central */}
      <Fade in={showContent} timeout={800}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          <Container maxWidth="xs">
            <Box
              component="img"
              src="/logo.png"
              alt="Logo Appelgustador"
              sx={{
                width: "300px",
                mx: "auto",
                mb: 4,
                display: "block",
              }}
            />

            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: "white",
                textShadow: "2px 2px 10px rgba(0,0,0,0.4)",
              }}
            >
              Iniciar Sesion
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

            <Box mt={2}>
              <Button
                variant="text"
                onClick={() => navigate("/forgot-password")}
                sx={{ color: "#0e37eeff", fontWeight: 500 }}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </Box>

            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                ¿No tienes cuenta?
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate("/register")}
                sx={{
                  mt: 1,
                  borderColor: "#EB2A05",
                  color: "#EB2A05",
                  fontWeight: "bold",
                  "&:hover": {
                    borderColor: "#c82104",
                    color: "#c82104",
                    background: "rgba(235, 42, 5, 0.1)",
                  },
                }}
              >
                Registrarse
              </Button>
            </Box>
          </Container>
        </Box>
      </Fade>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: "#111",
          color: "white",
          textAlign: "center",
          mt: "10vh",
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: "40px",
            background:
              "radial-gradient(circle at 50% 0%, rgba(235,42,5,0.7), transparent 70%)",
            filter: "blur(10px)",
          }}
        />
        <Container sx={{ py: 4 }}>
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            © 2025 Appelgustador. Todos los derechos reservados.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "#EB2A05" }}>
            Dirección: Calle 123 #45-67, Bogotá, Colombia | Tel: +57 300 123 4567
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "white" }}>
            contacto@appelgustador.com
          </Typography>
        </Container>
      </Box>

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
