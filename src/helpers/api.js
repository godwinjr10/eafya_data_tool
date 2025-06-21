import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
    // baseURL: "http://209.38.246.149/api"
});

export default API;