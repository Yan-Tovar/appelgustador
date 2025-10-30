import { useState } from "react";
import axios from "axios";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export default function SearchBarCategorias({ onResults }) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/productos/buscarcateogoria/", {
        params: { q: query },
      });
      onResults(response.data);
    } catch (error) {
      console.error("Error al buscar categorias:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 2,
        mb: 2,
        px: 2,
        width: "100%",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar categorias..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{
          maxWidth: 500,
          backgroundColor: "background.paper",
          borderRadius: 2,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleSearch}
                edge="end"
                color="primary"
                sx={{
                  backgroundColor: "primary.main",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
