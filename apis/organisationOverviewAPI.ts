import { OrgOverviewDTO } from "../hooks/useOrganisationOverview";
import { BASE_URL } from "../utils/globals";
import axios from "axios";

export const fetchAllOrganisationsRequest = async (userId: string) => {
  if (!userId) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  const url = `${BASE_URL}/organizations/user/${userId}`;
  const res = await axios.get(url).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med at hente organisationer");
    }
  });

  if (!res) {
    throw new Error("Fejl: Der opstod et problem med at hente organisationer");
  }

  return res.data;
};

export const deleteOrganisationRequest = async (userId: string | null, organisationId: number) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }
  //Do so only the owner can delete the organisation Implement with auth
  if (userId !== null) {
    throw new Error("Fejl: Kun ejeren af organisationen kan slette den");
  }

  const url = `${BASE_URL}/organizations/${organisationId}`;
  const res = await axios.delete(url).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med at slette organisationen");
    }
  });

  if (!res) {
    throw new Error("Fejl: Der opstod et problem med at slette organisationen");
  }
};

export const createOrganisationsRequest = async (
  userId: string,
  orgName: string
): Promise<OrgOverviewDTO> => {
  const params = new URLSearchParams();
  params.append("id", userId);

  const url = `${BASE_URL}/organizations?${params.toString()}`;
  const payload = { name: orgName };

  const res = await axios
    .post(url, payload, {
      headers: { "Content-Type": "application/json" },
    })
    .catch((error) => {
      if (error.response) {
        throw new Error(error.message || "Fejl: Der opstod et problem med at oprette organisation");
      }
    });

  if (!res) {
    throw new Error("Fejl: Der opstod et problem med at oprette organisation");
  }

  return res.data;
};
