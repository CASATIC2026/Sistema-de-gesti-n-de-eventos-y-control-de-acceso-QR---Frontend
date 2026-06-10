import axios from "axios";

const api = axios.create({
//baseURL: "https://localhost:7206/api",
//baseURL: "https://192.168.0.113:7206/api",
//baseURL: "http://192.168.137.21:5255/api", //CORECTA Q CORRE EN LA USAM
baseURL: "https://sistema-de-gesti-n-de-eventos-y-control.onrender.com/api",
});

// interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default api;