import axios from "axios";

const API = axios.create({
    //baseURL: 'http://localhost:5000/api'
    baseURL: process.env.NODE_ENV === 'production' 
        ? process.env.REACT_APP_API_URL_PROD 
        : process.env.REACT_APP_API_URL_DEV
});

export default API;