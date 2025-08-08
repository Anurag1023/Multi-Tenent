import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://multi-tenent-21w6ozry4-anurag-singhs-projects-39fc9ce5.vercel.app/api" || "http://localhost:5000/api",
  withCredentials: true,
});
