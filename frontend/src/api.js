import axios from 'axios';

// ✅ Direct backend URL (no .env needed)
const baseURL = "https://devpo-backend-production.up.railway.app/api";

console.log("🌍 Axios Base URL:", baseURL);

const API = axios.create({
  baseURL,            // already ends with /api
  withCredentials: true, // keep cookies/auth
});

export default API;
