import axios from "axios";
import login from "../app/auth/login";
//import { BASE_URL } from "../utils/globals";

const BASE_URL = "https://allowing-bluejay-model.ngrok-free.app";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setBearer = (token: string) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Successful request (2xx status)
  },
  (error) => {
    //console.log(error.response || error.message);

    return Promise.reject(error);
  }
);
