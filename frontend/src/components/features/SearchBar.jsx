import { useTheme } from "@mui/material/styles";
import { InputBase, Paper, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export default function SearchBar({ onSearch }) {
  const theme = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query && onSearch) onSearch(query);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        width: { xs: 120, sm: 200, md: 300 },
        px: 1,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <InputBase
        name="search"
        placeholder="Buscar..."
        sx={{ ml: 1, flex: 1 }}
        inputProps={{ "aria-label": "buscar" }}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="buscar">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
