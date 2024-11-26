import { BASE_URL } from "../utils/globals";
import axios from "axios";

/**
 * Function that sends a POST request to the server to try to login.
 * @param username {string} - The username of the user.
 * @param password {string} - The password of the user.
 */
export async function tryLogin(username: string, password: string) {
  const res = await axios.post(`${BASE_URL}/login`, { username, password }).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med login");
    }
  });

  if (!res) {
    throw new Error("Fejl: Der opstod et problem med login");
  }

  return res.data;
}
