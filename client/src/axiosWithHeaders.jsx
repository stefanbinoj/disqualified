import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.86:4002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
