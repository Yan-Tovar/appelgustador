// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Interceptor para adjuntar token
api.interceptors.request.use(
  async (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para refrescar el token automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el access expiró y no hemos reintentado aún
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (refresh) {
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh,
          });
          localStorage.setItem("access", res.data.access);

          // Reintentar la petición con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error("Error refrescando token:", err);
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;