import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Container,
  Box,
} from "@mui/material";

export default function DashboardCliente() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Carrito",
      description: "Carrito de compras",
      image: "/categorias.png",
      path: "/cliente/cart",
      button: "Ver Carrito",
    },
    {
      title: "Productos",
      description: "Explora los productos disponibles",
      image: "/productos.png",
      path: "/cliente/productos-disponibles",
      button: "Ver Productos",
    },
    {
      title: "Pedidos",
      description: "Revisa tus pedidos realizados",
      image: "/pedidos.png",
      path: "/cliente/pedidos",
      button: "Ver Pedidos",
    },
    {
      title: "Perfil",
      description: "Administra tu información personal",
      image: "/perfil.png",
      path: "/cliente/perfil",
      button: "Ver Perfil",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* Encabezado */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          gutterBottom
        >
          Bienvenido, Cliente
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gestiona tu cuenta, tus pedidos y mucho más
        </Typography>
      </Box>

      {/* Grid de opciones */}
      <Grid container spacing={4}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={section.title}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 3,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 6,
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Imagen */}
              <CardMedia
                component="img"
                image={section.image}
                alt={section.title}
                sx={{
                  height: 180,
                  objectFit: "contain",
                  p: 2,
                  width: "auto",
                  margin: "0 auto",
                }}
              />

              {/* Contenido */}
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Typography
                  variant="h6"
                  color="text.primary"
                  fontWeight="bold"
                >
                  {section.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  {section.description}
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => navigate(section.path)}
                  sx={{
                    mt: 2,
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    fontWeight: "bold",
                    backgroundColor: "#EB2A05", // naranja
                    "&:hover": { backgroundColor: "#c62828" }, // tono más oscuro
                  }}
                >
                  {section.button}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}