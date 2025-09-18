import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Fade,
} from "@mui/material";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(true);

  const handleNavigate = (path) => {
    setShowContent(false);
    setTimeout(() => {
      navigate(path);
    }, 500);
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
          <Container>
            {/* Imagen centrada */}
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
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: "white",
                textShadow: "2px 2px 10px rgba(0,0,0,0.4)",
              }}
            >
              Bienvenido a Appelgustador
            </Typography>

            <Typography
              variant="h6"
              gutterBottom
              sx={{
                maxWidth: "600px",
                mx: "auto",
                mb: 4,
                color: "#222",
              }}
            >
              Una experiencia gastronómica única que mezcla tradición y modernidad.
            </Typography>

            {/* Botones */}
            <Stack direction="row" spacing={3} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => handleNavigate("/login")}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  background: "#EB2A05",
                  color: "white",
                  fontWeight: "bold",
                  boxShadow: "0px 4px 15px rgba(235, 42, 5, 0.4)",
                  "&:hover": {
                    background: "#c82104",
                    boxShadow: "0px 6px 20px rgba(200, 33, 4, 0.6)",
                  },
                }}
              >
                Iniciar sesión
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => handleNavigate("/register")}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
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
            </Stack>
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
          marginTop: "25vh", 
          position: "relative",
        }}
      >
        {/* Encabezado mágico */}
        <Box
          sx={{
            height: "40px",
            background:
              "radial-gradient(circle at 50% 0%, rgba(235,42,5,0.7), transparent 70%)",
            filter: "blur(10px)",
          }}
        />
        {/* Contenido completo */}
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
    </Box>
  );
}