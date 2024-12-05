import { GradeDTO } from "../hooks/useGrades";
import { CitizenDTO, FullOrgDTO } from "../hooks/useOrganisation";
import { axiosInstance } from "./axiosConfig";

export const addCitizenToGradeRequest = (citizenIds: number[], gradeId: number): Promise<GradeDTO> => {
  return axiosInstance
    .put(`/grades/${gradeId}/add-citizens`, citizenIds)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke tilføje borger til klasse");
    });
};

export const fetchCitizenById = (citizenId: number): Promise<CitizenDTO> => {
  return axiosInstance
    .get(`/citizens/${citizenId}`)

    .then((res) => res.data)
    .catch(() => {
      throw new Error(`Fejl: Kunne ikke hente borger.`);
    });
};

export const fetchOrganisationFromGradeRequest = (gradeId: number): Promise<FullOrgDTO> => {
  if (gradeId === null || gradeId === undefined) {
    throw new Error("FATAL FEJL: Klasse-ID er ikke korrekt initialiseret i din session.");
  }

  return axiosInstance
    .get(`/organizations/grades/${gradeId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(`Fejl: Kunne ikke hente organisation.`);
    });
};

export const removeCitizenFromGradeRequest = (citizenIds: number[], gradeId: number): Promise<GradeDTO> => {
  return axiosInstance
    .put(`/grades/${gradeId}/remove-citizens`, citizenIds)
    .then((res) => res.data)
    .catch((error) => {
      if (error.response) {
        throw new Error("Fejl: Kunne ikke fjerne borger fra klasse");
      }
    });
};

export const createNewGradeRequest = async (gradeName: string, orgId: number): Promise<GradeDTO> => {
  return axiosInstance
    .post(`/grades`, { name: gradeName }, { params: { orgId } })
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(error.message || "Fejl: Kunne ikke oprette klasse");
    });
};

export const updateGradeRequest = async (gradeId: number, newName: string) => {
  return axiosInstance
    .put(`/grades/${gradeId}/change-name`, {}, { params: { newName } })
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke opdatere klasse");
    });
};

export const deleteGradeRequest = async (gradeId: number) => {
  const url = `${BASE_URL}/grades/${gradeId}`;
  return await axios.delete(url).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Kunne ikke slette klasse");
    }
  });
};
