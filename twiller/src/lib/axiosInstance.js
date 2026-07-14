import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://twiller-8o7n.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;