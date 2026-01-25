import axios from "axios";

const api = axios.create({
  baseURL: "https://valentines-app-1.onrender.com"
});

export default api;
