import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://multi-tenent-navy.vercel.app/api" || "http://localhost:5000/api",
  withCredentials: true,
});
