import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;
console.log("🌍 Axios Base URL:", baseURL);

const API = axios.create({
  baseURL,
  withCredentials: true,
});

export default API;

  
//"C:\Users\hp\Desktop\memo\proto1\frontend\src\api.js"