import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL_PROD || "https://api.example.com"
      : process.env.REACT_APP_API_URL_DEV || "http://localhost:5000/api",
});

export default API;
