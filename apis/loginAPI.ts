import { BASE_URL } from "../utils/globals";
import axios from "axios";

/**
 * Function that sends a POST request to the server to try to login.
 * @param email {string} - The username of the user.
 * @param password {string} - The password of the user.
 */
export async function tryLogin(username: string, password: string) {
  try {
    const res = await axios.post(
      `${BASE_URL}/login`,
      { username, password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.data;
  } catch (error: any) {
    const errorMessage = error.message || "Fejl: Ugyldigt login";
    throw new Error(errorMessage);
  }
}
