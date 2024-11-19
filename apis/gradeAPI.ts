import { GradeDTO } from "../hooks/useGrades";
import { CitizenDTO, FullOrgDTO } from "../hooks/useOrganisation";
import { BASE_URL } from "../utils/globals";
export const addCitizenToGradeRequest = async (citizenIds: number[], gradeId: number): Promise<GradeDTO> => {
  const url = `${BASE_URL}/grades/${gradeId}/add-citizens`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(citizenIds),
  });
  if (!res.ok) throw new Error("Kunne ikke tilføje borger til klasse");
  return res.json();
};

export const fetchCitizenById = async (citizenId: number): Promise<CitizenDTO> => {
  const url = `${BASE_URL}/citizens/${citizenId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunne ikke hente borger");
  return res.json();
};

/**
 * @param gradeId
 * @returns
 * an organisation object
 */
export const fetchOrganisationFromGradeRequest = async (gradeId: number): Promise<FullOrgDTO> => {
  if (gradeId === null) {
    throw new Error("FATAL FEJL: Klasse-ID er ikke korrekt initialiseret i din session.");
  }

  const url = `${BASE_URL}/organizations/grades/${gradeId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunne ikke hente organisation");
  return res.json();
};

export const removeCitizenFromGradeRequest = async (
  citizenIds: number[],
  gradeId: number
): Promise<GradeDTO> => {
  const url = `${BASE_URL}/grades/${gradeId}/remove-citizens`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(citizenIds),
  });
  if (!res.ok) throw new Error("Kunne ikke fjerne borger fra klasse");
  return res.json();
};

export const createNewGradeRequest = async (gradeName: string, orgId: number): Promise<GradeDTO> => {
  const url = `${BASE_URL}/grades?orgId=${orgId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: gradeName }),
  });
  if (!res.ok) throw new Error("Kunne ikke oprette klasse");
  return res.json();
};
