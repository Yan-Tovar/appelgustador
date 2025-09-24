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

export default function DashboardCliente() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Bienvenido, Cliente
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
              <Typography variant="h6">Carrito</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Carrito de compras
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/cliente/cart")}
              >
                Ver Carrito
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}