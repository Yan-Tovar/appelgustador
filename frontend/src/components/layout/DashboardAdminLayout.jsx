import { Outlet, useNavigate } from "react-router-dom";
// 'Outlet' renderiza las rutas hijas dentro del layout.
// 'useNavigate' permite redirigir programáticamente entre rutas.

import { useState } from "react";
// Hook para manejar estados locales como el modo oscuro o la apertura del drawer.

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
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
// Componentes de Material UI para construir la interfaz visual del dashboard.

import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Brightness4,
  Brightness7,
  AccountCircleRounded,
  Category as CategoryIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
// Íconos usados en el menú lateral y en la barra superior.

export default function DashboardAdminLayout({ onLogout }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false); // Modo oscuro activado/desactivado
  const [open, setOpen] = useState(false); // Drawer abierto en móviles
  const [confirmOpen, setConfirmOpen] = useState(false); // Diálogo de confirmación de logout

  const isMobile = useMediaQuery("(max-width:600px)"); // Detecta si el dispositivo es móvil
  const drawerWidth = 240; // Ancho del menú lateral

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#EB2A05" }, // Color principal (rojo)
      secondary: { main: "#2e7d32" }, // Color secundario (verde)
    },
  });

  const menuItems = [
    { text: "Inicio", icon: <HomeIcon />, path: "/admin" },
    { text: "Categorias", icon: <CategoryIcon />, path: "/admin/categorias" },
    { text: "Productos", icon: <InventoryIcon />, path: "/admin/productos" },
    { text: "Perfil", icon: <AccountCircleRounded />, path: "/admin/perfil" },
    { text: "Gestión Usuarios", icon: <PeopleIcon />, path: "/admin/gestionusuarios" },
  ];
  //Lista de secciones disponibles en el panel, con íconos y rutas asociadas.

  // Drawer reutilizable
  const drawerContent = (
    <List>
      {menuItems.map((item) => (
        <ListItem
          button
          key={item.text}
          onClick={() => {
            navigate(item.path);
            if (isMobile) setOpen(false); // cerrar en móviles al navegar
          }}
        >
          <ListItemIcon sx={{ color: theme.palette.primary.main }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );
  // Renderiza los ítems del menú lateral.
  // Cierra el drawer automáticamente en móviles al hacer clic.

  const handleOpenLogoutConfirm = () => {
    const audio = new Audio("/logout.mp3"); // debe estar en /public
    audio.play(); // Reproduce sonido de cierre de sesión
    setConfirmOpen(true); // Abre el diálogo de confirmación
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/*Aplica el tema visual y normaliza los estilos base. */}

      {/* Barra superior */}
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setOpen(true)}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Panel Administrador
          </Typography>

          {/* Botón Modo Oscuro */}
          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Botón Logout */}
          <IconButton
            color="inherit"
            onClick={handleOpenLogoutConfirm}
            edge="end"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer temporal para móviles */}
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
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Drawer permanente para escritorio */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      {/* Contenido dinámico */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Outlet />
      </Box>

      {/* Confirmación de logout */}
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
