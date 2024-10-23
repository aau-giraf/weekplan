import { BASE_URL } from "../utils/globals";

export async function tryLogin(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Ugyldig login");
  return res.json();
}
