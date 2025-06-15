import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
    // baseURL: "http://164.90.209.79/api"
});

export default API;