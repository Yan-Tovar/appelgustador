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
  Alert,
} from "@mui/material";

export default function ProductosDisponibles() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [error, setError] = useState(null); // Para mostrar errores de la API
  const [loading, setLoading] = useState(true); // Para mostrar el estado de carga

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProductosDisponibles();
  }, []);

  // Obtención de productos disponibles
  const fetchProductosDisponibles = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/productos/disponibles/",
        config
      );
      setProductos(res.data);
      setLoading(false);
    } catch (error) {
      setError("Error al obtener productos disponibles. Intente de nuevo.");
      setLoading(false);
      console.error("Error al obtener productos disponibles:", error);
    }
  };

  // Manejo de cambios en la cantidad de un producto
  const handleCantidadChange = (productId, value) => {
    // Si no es un número o el valor es negativo, lo ponemos como 1
    const cantidad = Math.max(1, Math.min(value, productos.find((prod) => prod.id === productId)?.stock || 1));
    setCantidades((prev) => ({
      ...prev,
      [productId]: cantidad,
    }));
  };

  // Manejo de agregar al carrito
  const handleAddToCart = async (productId) => {
    const cantidad = cantidades[productId] || 1; // Si no se digitó cantidad, usa 1
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart/add/",
        { product_id: productId, quantity: cantidad },
        config
      );
      alert("Producto agregado al carrito!");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      setError("Error al agregar el producto al carrito. Intente de nuevo.");
    }
  };

  // Renderiza un mensaje de error si lo hay
  const renderError = () => {
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Productos Disponibles
      </Typography>

      {renderError()}

      {loading ? (
        <Typography variant="body1" color="textSecondary">
          Cargando productos...
        </Typography>
      ) : (
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
                    inputProps={{
                      min: 1,
                      max: prod.stock,
                      step: 1, 
                    }}
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
      )}
    </Box>
  );
}