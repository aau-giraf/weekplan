import { BASE_URL } from "../utils/globals";
import axios from "axios";

/**
 * Function for sending a request to the API endpoint to create a new user.
 * @param userData {object} - The user data to be sent to the API.
 */

type CreateUserRequestProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type CreateUserResponseProps = {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
};

export const createUserRequest = async (
  userData: CreateUserRequestProps
): Promise<CreateUserResponseProps> => {
  try {
    const res = await axios.post(`${BASE_URL}/users`, userData, {
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (error: any) {
    const errorMessage = error.message || "Fejl: Kunne ikke oprette bruger";
    throw new Error(errorMessage);
  }
};
