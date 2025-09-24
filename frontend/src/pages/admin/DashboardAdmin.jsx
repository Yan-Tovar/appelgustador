import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Container,
} from "@mui/material";

export default function DashboardAdmin() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Bienvenido, Administrador
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            {/* Imagen */}
            <CardMedia
              component="img"
              image="/categorias.png"
              alt="Imagen Categoría"
              sx={{
                height: 180,         
                objectFit: "contain", 
                p: 2,                 
                width: "auto",        
                margin: "0 auto",   
              }}
            />
            <CardContent>
              <Typography variant="h6">Categorias</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Gestiona Categorias de productos
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/admin/categorias")}
              >
                Ver Categorias
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            {/* Imagen */}
            <CardMedia
              component="img"
              image="/productos.png"
              alt="Imagen Productos"
              sx={{
                height: 180,         
                objectFit: "contain", 
                p: 2,                 
                width: "auto",        
                margin: "0 auto",   
              }}
            />
            <CardContent>
              <Typography variant="h6">Productos</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Administra productos y servicios
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/admin/productos")}
              >
                Ver Productos
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            {/* Imagen */}
            <CardMedia
              component="img"
              image="/perfil.png"
              alt="Imagen Usuario"
              sx={{
                height: 180,         
                objectFit: "contain", 
                p: 2,                 
                width: "auto",        
                margin: "0 auto",   
              }}
            />
            <CardContent>
              <Typography variant="h6">Perfil</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ajusta tus datos de usuario
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/admin/perfil")}
              >
                Ver Perfil
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            {/* Imagen */}
            <CardMedia
              component="img"
              image="/gestionUsuarios.png"
              alt="Imagen Usuarios"
              sx={{
                height: 180,         
                objectFit: "contain", 
                p: 2,                 
                width: "auto",        
                margin: "0 auto",   
              }}
            />
            <CardContent>
              <Typography variant="h6">Gestion Usuarios</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Gestiona Usuarios del sistema
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/admin/gestionusuarios")}
              >
                Ver Usuarios
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}