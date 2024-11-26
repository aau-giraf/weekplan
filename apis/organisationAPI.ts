import { BASE_URL } from "../utils/globals";
import axios from "axios";

export const fetchOrganisationRequest = async (organisationId: number) => {
  const url = `${BASE_URL}/organizations/${organisationId}`;
  const res = await axios.get(url).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med anmodningen");
    }
  });

  if (!res) {
    throw new Error("Fejl: Der opstod et problem med anmodningen");
  }

  return res.data;
};

export const createCitizenRequest = async (
  firstname: string,
  lastName: string,
  orgId: number
): Promise<number> => {
  const url = `${BASE_URL}/citizens/${orgId}/add-citizen`;

  const res = await axios
    .post(
      url,
      { firstName: firstname, lastName: lastName },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .catch((error) => {
      if (error.response) {
        throw new Error(error.message || "Fejl: Der opstod et problem med anmodningen");
      }
    });

  if (!res) {
    throw new Error("Fejl: Der opstod et problem med anmodningen");
  }

  return res.data;
};

export const deleteCitizenRequest = async (orgId: number, citizenId: number) => {
  const url = `${BASE_URL}/citizens/${orgId}/remove-citizen/${citizenId}`;
  return await axios.delete(url).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med anmodningen");
    }
  });
};

export const deleteMemberRequest = async (orgId: number, memberId: string) => {
  const url = `${BASE_URL}/organizations/${orgId}/remove-user/${memberId}`;
  return await axios.put(url).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med anmodningen");
    }
  });
};

export const updateCitizenRequest = async (citizenId: number, firstName: string, lastName: string) => {
  const url = `${BASE_URL}/citizens/${citizenId}`;
  return await axios.put(url, { firstName, lastName }).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med anmodningen");
    }
  });
};
