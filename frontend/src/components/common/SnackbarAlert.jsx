import { useTheme } from "@mui/material/styles";
import { Snackbar, Alert } from "@mui/material";

export default function SnackbarAlert({ open, message, severity, onClose }) {
  const theme = useTheme();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          backgroundColor:
            severity === "success"
              ? theme.palette.secondary.main
              : severity === "error"
              ? theme.palette.error.main
              : severity === "warning"
              ? theme.palette.warning.main
              : theme.palette.info.main,
          color: "#fff",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
