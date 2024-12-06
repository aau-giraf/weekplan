import { OrgOverviewDTO } from "../hooks/useOrganisationOverview";
import { axiosInstance } from "./axiosConfig";

export const fetchAllOrganisationsRequest = (userId: string) => {
  if (!userId) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  return axiosInstance
    .get(`/organizations/user/${userId}`)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med at hente organisationer");
    });
};

export const deleteOrganisationRequest = (organisationId: number) => {
  return axiosInstance
    .delete(`/organizations/${organisationId}`)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med at slette organisationen");
    });
};

export const createOrganisationsRequest = (userId: string, orgName: string): Promise<OrgOverviewDTO> => {
  return axiosInstance
    .post(
      `/organizations`,
      {
        name: orgName,
      },
      {
        params: {
          id: userId,
        },
      }
    )
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med at oprette organisation");
    });
};
