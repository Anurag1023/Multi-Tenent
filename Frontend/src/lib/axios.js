import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://multi-tenent-omega.vercel.app/api",
  withCredentials: true,
});
