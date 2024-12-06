/**
 * Function for sending a request to the API endpoint to create a new user.
 * @param userData {object} - The user data to be sent to the API.
 */
import { axiosInstance } from "./axiosConfig";

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

export const createUserRequest = (userData: CreateUserRequestProps): Promise<CreateUserResponseProps> => {
  return axiosInstance
    .post(`/users`, userData)
    .then((res) => res.data)
    .catch((error) => {
      if (error.response) {
        throw new Error(error.message || "Fejl: Kunne ikke oprette bruger");
      }
    });
};
