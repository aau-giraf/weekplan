import { axiosInstance } from "./axiosConfig";

export const fetchOrganisationRequest = (organisationId: number) => {
  return axiosInstance
    .get(`/organizations/${organisationId}`)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med anmodningen");
    });
};

export const createCitizenRequest = (firstname: string, lastName: string, orgId: number): Promise<number> => {
  return axiosInstance
    .post(`/citizens/${orgId}/add-citizen`, { firstName: firstname, lastName: lastName })
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med anmodningen");
    });
};

export const deleteCitizenRequest = (orgId: number, citizenId: number) => {
  return axiosInstance
    .delete(`/citizens/${orgId}/remove-citizen/${citizenId}`)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med anmodningen");
    });
};

export const deleteMemberRequest = (orgId: number, memberId: string) => {
  return axiosInstance
    .put(`/organizations/${orgId}/remove-user/${memberId}`)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med anmodningen");
    });
};

export const updateCitizenRequest = (citizenId: number, firstName: string, lastName: string) => {
  return axiosInstance
    .put(`/citizens/${citizenId}`, { firstName, lastName })
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med anmodningen");
    });
};

export const updateOrganisationRequest = async (orgId: number, name: string) => {
  const url = `${BASE_URL}/organizations/${orgId}/change-name?newName=${name}`;
  return await axios.put(url, { name }).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Kunne ikke opdatere organisation");
    }
  });
};
