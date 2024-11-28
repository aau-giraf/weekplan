import axios from "axios";
import { BASE_URL } from "../utils/globals";

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
    //console.log(response.status + ": " + response.request.responseURL); // Should display all successful requests
    return response; // Successful request (2xx status)
  },
  (error) => {
    //console.log(error.status + ": " + error.request.responseURL); // Should display all faulty requests
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      axiosInstance.post(`/refresh`, { withCredentials: true }).then((response) => {
        setBearer(response.data.token);
        axiosInstance(error.response);
      });
    }
    return Promise.reject(error);
  }
);
