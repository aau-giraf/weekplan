import axios from "axios";
import { BASE_URL } from "../utils/globals";
import * as SecureStore from "expo-secure-store";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Successful request (2xx status)
  },
  (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = SecureStore.getItem("RefreshToken");

      const accessToken = axios
        .post("TEST LOOK HERE", { token: refreshToken })
        .then((res) => res.data.accessToken)
        .catch(() => {
          console.error(error.response || error.message);
          return Promise.reject(error);
        });

      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      originalRequest.headers.common.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
    } else {
      console.error(error.response || error.message);
      return Promise.reject(error);
    }
  }
);
