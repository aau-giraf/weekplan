import { BASE_URL } from "../utils/globals";

/**
 * Function that sends a POST request to the server to try to login.
 * @param email {string} - The username of the user.
 * @param password {string} - The password of the user.
 */
export async function tryLogin(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Fejl: Ugyldig login");
  return res.json();
}
