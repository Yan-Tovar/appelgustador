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
  Divider,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  HomeOutlined,
  PeopleOutline,
  SettingsOutlined,
  PersonOutline,
  Logout,
  HistoryOutlined,
} from "@mui/icons-material";

import Swal from "sweetalert2";
import SearchBar from "../components/features/SearchBar";
import ProfileMenu from "../components/features/ProfileMenu";
import SnackbarAlert from "../components/common/SnackbarAlert";

export default function DashboardAdminLayout({ onLogout }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:601px) and (max-width:960px)");
  const drawerWidth = 240;

  // Obtener token y username desde localStorage
  const token = localStorage.getItem("access");
  const userData = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const username = userData?.username || "Usuario";

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#EB2A05" },
      secondary: { main: "#2e7d32" },
      background: {
        default: darkMode ? "#121212" : "#f4f4f4",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#000000",
        secondary: darkMode ? "#bbbbbb" : "#555555",
      },
    },
  });

  const menuItems = [
    { text: "Inicio", icon: <HomeOutlined />, path: "/admin" },
    { text: "Gestión Usuarios", icon: <PeopleOutline />, path: "/admin/gestionusuarios" },
    { text: "Historial", icon: <HistoryOutlined />, path: "/admin/historial" },
    { text: "Perfil", icon: <PersonOutline />, path: "/admin/perfil" },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <Toolbar
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Hola! { username}
        </Typography>
      </Toolbar>

      <Divider />

      <List sx={{ flexGrow: 1, px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile || isTablet) setOpen(false);
              setSnackbar({ open: true, message: `Navegando a ${item.text}`, severity: "info" });
            }}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              justifyContent: "center",
              textAlign: "center",
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                color: "#fff",
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Esta acción te desconectará del sistema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EB2A05",
      cancelButtonColor: "#999",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
        if (onLogout) onLogout();
        setSnackbar({ open: true, message: "Sesión cerrada correctamente", severity: "success" });
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          {(isMobile || isTablet) && (
            <IconButton color="inherit" onClick={() => setOpen(true)} edge="start">
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            El Gustador
          </Typography>

          <SearchBar />

          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <ProfileMenu onLogout={handleLogout} />
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      {(isMobile || isTablet) ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              overflowX: "hidden",
              top: 64,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              overflowX: "hidden",
              top: 64,
              position: "fixed",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
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

      {/* Snackbar */}
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </ThemeProvider>
  );
}
