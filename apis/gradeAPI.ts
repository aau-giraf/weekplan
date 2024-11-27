import { GradeDTO } from "../hooks/useGrades";
import { CitizenDTO, FullOrgDTO } from "../hooks/useOrganisation";
import { BASE_URL } from "../utils/globals";
import axios from "axios";

export const addCitizenToGradeRequest = async (citizenIds: number[], gradeId: number): Promise<GradeDTO> => {
  const url = `${BASE_URL}/grades/${gradeId}/add-citizens`;
  const res = await axios.put(url, citizenIds).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Kunne ikke tilføje borger til klasse");
    }
  });

  if (!res) {
    throw new Error("Fejl: Kunne ikke tilføje borger til klasse");
  }

  return res.data;
};

export const fetchCitizenById = async (citizenId: number): Promise<CitizenDTO> => {
  const url = `${BASE_URL}/citizens/${citizenId}`;
  const res = await axios.get(url).catch((error) => {
    if (error.response) {
      throw new Error(`Fejl: Kunne ikke hente borger. Detaljer: ${error.message}`);
    }
  });

  if (!res) {
    throw new Error("Fejl: Kunne ikke hente borger.");
  }

  return res.data;
};

export const fetchOrganisationFromGradeRequest = async (gradeId: number): Promise<FullOrgDTO> => {
  if (gradeId === null || gradeId === undefined) {
    throw new Error("FATAL FEJL: Klasse-ID er ikke korrekt initialiseret i din session.");
  }

  const url = `${BASE_URL}/organizations/grades/${gradeId}`;
  const res = await axios.get(url).catch((error) => {
    if (error.response) {
      throw new Error(`Fejl: Kunne ikke hente organisation. Detaljer: ${error.message}`);
    }
  });

  if (!res) {
    throw new Error("Fejl: Kunne ikke hente organisation.");
  }

  return res.data;
};

export const removeCitizenFromGradeRequest = async (
  citizenIds: number[],
  gradeId: number
): Promise<GradeDTO> => {
  const url = `${BASE_URL}/grades/${gradeId}/remove-citizens`;
  const res = await axios.put(url, citizenIds).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Kunne ikke fjerne borger fra klasse");
    }
  });

  if (!res) {
    throw new Error("Fejl: Kunne ikke fjerne borger fra klasse");
  }

  return res.data;
};

export const createNewGradeRequest = async (gradeName: string, orgId: number): Promise<GradeDTO> => {
  const url = `${BASE_URL}/grades?orgId=${orgId}`;
  const res = await axios.post(url, { name: gradeName }).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Kunne ikke oprette klasse");
    }
  });

  if (!res) {
    throw new Error("Fejl: Kunne ikke oprette klasse");
  }

  return res.data;
};

export const updateGradeRequest = async (gradeId: number, gradeName: string) => {
  const url = `${BASE_URL}/grades/${gradeId}/change-name?newName=${gradeName}`;
  return await axios.put(url, { name: gradeName }).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Kunne ikke opdatere klasse");
    }
  });
};
