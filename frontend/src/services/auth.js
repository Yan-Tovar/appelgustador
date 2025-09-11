import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users/";

export const login = async (email, password) => {
  try {
    const response = await axios.post(${API_URL}login/, {
      email,
      password,
    });
    if (response.data.access) {
      localStorage.setItem("token", response.data.access); // Guardamos JWT
    }
    return response.data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};