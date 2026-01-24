import axios from "axios";

const api = axios.create({
  baseURL: "https://valentines-app-ramf.onrender.com"
});

export default api;
