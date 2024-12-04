import { axiosInstance, setBearer } from "./axiosConfig";

/**
 * Function that sends a POST request to the server to try to login.
 * @param username {string} - The username of the user.
 * @param password {string} - The password of the user.
 */
export async function tryLogin(username: string, password: string) {
  return axiosInstance
    .post(`/login`, { username, password })
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med login");
    });
}

export function refreshToken() {
  axiosInstance
    .post(`/refresh`, { withCredentials: true })
    .then((response) => {
      setBearer(response.data.token);
    })
    .catch((err) => err);
}