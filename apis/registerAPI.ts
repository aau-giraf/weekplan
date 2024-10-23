import { BASE_URL } from "../utils/globals";

/**
 * Function for sending a request to the API endpoint to create a new user.
 * @param userData {object} - The user data to be sent to the API.
 */
export const createUserRequest = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Fejl: Kunne ikke oprette bruger");
  return await res.json();
};
