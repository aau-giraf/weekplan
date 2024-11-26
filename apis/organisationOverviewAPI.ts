import { OrgOverviewDTO } from "../hooks/useOrganisationOverview";
import { BASE_URL } from "../utils/globals";
import axios from "axios";

export const fetchAllOrganisationsRequest = async (userId: string) => {
  if (!userId) {
    return "FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.";
  }

  const url = `${BASE_URL}/organizations/user/${userId}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke hente dine organisationer.";
  }
};

export const deleteOrganisationRequest = async (organisationId: number) => {
  const url = `${BASE_URL}/organizations/${organisationId}`;
  try {
    const res = await axios.delete(url);
    if (res.status !== 200) {
      return "Fejl: Der er muligvis server problemer";
    }
  } catch (error: any) {
    return error.message || "Fejl: Der er muligvis server problemer";
  }
};

export const createOrganisationsRequest = async (
  userId: string,
  orgName: string
): Promise<OrgOverviewDTO> => {
  const url = `${BASE_URL}/organizations?id=${userId}`;
  const payload = { name: orgName };

  try {
    const { data } = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke oprette organisation.";
  }
};
