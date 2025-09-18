import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Renderiza la app dentro del <div id="root"></div> de index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
