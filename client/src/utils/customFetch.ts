import axios from "axios";

const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "";

if (import.meta.env.PROD && !API_URL) {
  throw new Error("VITE_API_URL is not configured");
}

const customFetch = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
});

export default customFetch;
