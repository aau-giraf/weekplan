import { BASE_URL } from "../utils/globals";
import axios from "axios";

export const fetchOrganisationRequest = async (organisationId: number) => {
  const url = `${BASE_URL}/organizations/${organisationId}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke hente data for organisationen.";
  }
};

export const createCitizenRequest = async (
  firstname: string,
  lastName: string,
  orgId: number
): Promise<number> => {
  const url = `${BASE_URL}/citizens/${orgId}/add-citizen`;
  try {
    const res = await axios.post(
      url,
      { firstName: firstname, lastName: lastName },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke oprette borger";
  }
};

export const deleteCitizenRequest = async (orgId: number, citizenId: number) => {
  const url = `${BASE_URL}/citizens/${orgId}/remove-citizen/${citizenId}`;
  try {
    const res = await axios.delete(url);

    if (res.status !== 200) {
      return "Fejl: Der er muligvis server problemer";
    }
  } catch (error: any) {
    return error.message || "Fejl: Der er muligvis server problemer";
  }
};

export const deleteMemberRequest = async (orgId: number, memberId: string) => {
  const url = `${BASE_URL}/organizations/${orgId}/remove-user/${memberId}`;
  try {
    const res = await axios.put(url);
    if (res.status !== 200) {
      return "Fejl: Der er muligvis server problemer";
    }
  } catch (error: any) {
    return error.message || "Fejl: Der er muligvis server problemer";
  }
};

export const updateCitizenRequest = async (citizenId: number, firstName: string, lastName: string) => {
  const url = `${BASE_URL}/citizens/${citizenId}`;
  try {
    const res = await axios.put(
      url,
      { firstName, lastName },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status !== 200) {
      return "Fejl: Kunne ikke opdatere borger";
    }
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke opdatere borger";
  }
};
