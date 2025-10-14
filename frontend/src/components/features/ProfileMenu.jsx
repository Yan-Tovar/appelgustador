import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { Logout, AccountCircleRounded } from "@mui/icons-material";

export default function ProfileMenu({ onLogout }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Obtener token y rol desde localStorage
  const token = localStorage.getItem("access");
  const userData = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const rol = userData?.rol || "empleado";

  // Determinar ruta de perfil según rol
  const perfilPath =
    rol === "administrador"
      ? "/admin/perfil"
      : rol === "cliente"
      ? "/cliente/perfil"
      : "/empleado/perfil";

  return (
    <>
      <IconButton onClick={handleOpen} size="small" sx={{ ml: 2 }}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
          {rol === "admin" ? "A" : "E"}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            minWidth: 180,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <MenuItem
          onClick={() => navigate(perfilPath)}
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
            <AccountCircleRounded />
          </ListItemIcon>
          <ListItemText primary="Perfil" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={onLogout}>
          <Logout fontSize="small" sx={{ mr: 1 }} />
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
}
