import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Brightness4,
  Brightness7,
  AccountCircleRounded,
  Logout as LogoutIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  ReceiptLong as ReceiptLongIcon,
} from "@mui/icons-material";

export default function DashboardClienteLayout({ onLogout }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:601px) and (max-width:960px)");
  const drawerWidth = 240;

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#EB2A05" }, // naranja
      secondary: { main: "#2e7d32" }, // verde
      background: {
        default: darkMode ? "#121212" : "#f4f4f4", // fondo general
        paper: darkMode ? "#1e1e1e" : "#ffffff",   // fondo de cards, drawers, etc
      },
      text: {
        primary: darkMode ? "#ffffff" : "#000000",
        secondary: darkMode ? "#bbbbbb" : "#555555",
      },
    },
  });

  const menuItems = [
    { text: "Inicio", icon: <HomeIcon />, path: "/cliente" },
    { text: "Carrito", icon: <ShoppingCartIcon />, path: "/cliente/cart" },
    { text: "Productos", icon: <ShoppingBagIcon />, path: "/cliente/productos-disponibles" },
    { text: "Pedidos", icon: <ReceiptLongIcon />, path: "/cliente/pedidos" },
    { text: "Perfil", icon: <AccountCircleRounded />, path: "/cliente/perfil" },
  ];

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Gustador
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 1,
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                color: "#fff",
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const handleOpenLogoutConfirm = () => {
    const audio = new Audio("/logout.mp3");
    audio.play();
    setConfirmOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* AppBar fija con sombra */}
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          {(isMobile || isTablet) && (
            <IconButton color="inherit" onClick={() => setOpen(true)} edge="start">
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Panel Cliente
          </Typography>

          {/* Dark mode */}
          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Logout */}
          <IconButton color="inherit" onClick={handleOpenLogoutConfirm} edge="end">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer móvil */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "background.paper", // <- Igual que arriba
              color: "text.primary",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Drawer tablet (persistent) */}
      {isTablet && (
        <Drawer
          variant="persistent"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            display: { xs: "none", sm: "block", md: "none" }, // solo en tablets
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "background.paper",
              color: "text.primary",
            },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      {/* Drawer escritorio */}
      {!isMobile && !isTablet && (
        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "background.paper", 
              color: "text.primary",               
            },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      {/* Contenido */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { md: `${drawerWidth}px` },
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Outlet />
      </Box>

      {/* Confirm logout */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>¿Seguro que quieres cerrar sesión?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
              if (onLogout) onLogout();
            }}
            color="error"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}