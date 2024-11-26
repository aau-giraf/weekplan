import { GradeDTO } from "../hooks/useGrades";
import { CitizenDTO, FullOrgDTO } from "../hooks/useOrganisation";
import { BASE_URL } from "../utils/globals";
import axios from "axios";

export const addCitizenToGradeRequest = async (citizenIds: number[], gradeId: number): Promise<GradeDTO> => {
  const url = `${BASE_URL}/grades/${gradeId}/add-citizens`;
  try {
    const res = await axios.put(url, citizenIds, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.message || "Fejl: Kunne ikke tilføje borger til klasse";
    throw new Error(errorMessage);
  }
};

export const fetchCitizenById = async (citizenId: number): Promise<CitizenDTO> => {
  const url = `${BASE_URL}/citizens/${citizenId}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error: any) {
    const errorMessage = error.message || "Ukendt fejl opstod";
    throw new Error(`Fejl: Kunne ikke hente borger. Detaljer: ${errorMessage}`);
  }
};

export const fetchOrganisationFromGradeRequest = async (gradeId: number): Promise<FullOrgDTO> => {
  if (gradeId === null || gradeId === undefined) {
    throw new Error("FATAL FEJL: Klasse-ID er ikke korrekt initialiseret i din session.");
  }

  const url = `${BASE_URL}/organizations/grades/${gradeId}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error: any) {
    const errorMessage = error.message || "Ukendt fejl opstod";
    throw new Error(`Fejl: Kunne ikke hente organisation. Detaljer: ${errorMessage}`);
  }
};

export const removeCitizenFromGradeRequest = async (
  citizenIds: number[],
  gradeId: number
): Promise<GradeDTO> => {
  const url = `${BASE_URL}/grades/${gradeId}/remove-citizens`;
  try {
    const res = await axios.put(url, citizenIds, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.message || "Fejl: Kunne ikke fjerne borger fra klasse";
    throw new Error(errorMessage);
  }
};

export const createNewGradeRequest = async (gradeName: string, orgId: number): Promise<GradeDTO> => {
  const url = `${BASE_URL}/grades?orgId=${orgId}`;
  try {
    const res = await axios.post(
      url,
      { name: gradeName },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error: any) {
    const errorMessage = error.message || "Fejl: Kunne ikke oprette klasse";
    throw new Error(errorMessage);
  }
};
