import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export const registerUser= async (userData) => {
  return await API.post("/users/register/", userData);
};
