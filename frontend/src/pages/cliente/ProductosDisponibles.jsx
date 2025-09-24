import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
} from "@mui/material";

export default function ProductosDisponibles() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({}); 
  // objeto { productoId: cantidad } para manejar cantidades independientes

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProductosDisponibles();
  }, []);

  const fetchProductosDisponibles = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/productos/disponibles/",
        config
      );
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos disponibles:", error);
    }
  };

  const handleCantidadChange = (productId, value) => {
    // Actualiza la cantidad en el estado según el producto
    setCantidades((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleAddToCart = async (productId) => {
    const cantidad = cantidades[productId] || 1; // por defecto 1 si no se digitó nada
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart/add/",
        { product_id: productId, quantity: cantidad },
        config
      );
      alert("Producto agregado al carrito!");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Productos Disponibles
      </Typography>

      <Grid container spacing={3}>
        {productos.map((prod) => (
          <Grid item xs={12} sm={6} md={4} key={prod.id}>
            <Card>
              {prod.imagen && (
                <CardMedia
                  component="img"
                  height="140"
                  image={prod.imagen}
                  alt={prod.nombre}
                />
              )}
              <CardContent>
                <Typography variant="h6">{prod.nombre}</Typography>
                <Typography color="text.secondary">
                  Precio: ${prod.precio}
                </Typography>
                <Typography color="text.secondary">
                  Stock: {prod.stock}
                </Typography>

                {/* Campo para elegir cantidad */}
                <TextField
                  type="number"
                  label="Cantidad"
                  size="small"
                  value={cantidades[prod.id] || ""}
                  onChange={(e) =>
                    handleCantidadChange(prod.id, parseInt(e.target.value) || 1)
                  }
                  inputProps={{ min: 1, max: prod.stock }}
                  sx={{ mt: 1, width: "100px" }}
                />
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(prod.id)}
                >
                  Agregar al Carrito
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}