import { BASE_URL } from "../utils/globals";
export const fetchClassRequest = async (classId: number) => {
  if (classId === null) {
    throw new Error("FATAL FEJL: Klasse-ID er ikke korrekt initialiseret i din session.");
  }

  const url = `${BASE_URL}/grades/${classId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunne ikke hente klassen");
  return res.json();
};

export const addCitizenToClassRequest = async (citizenId: number, classId: number) => {
  const url = `${BASE_URL}/grades/${classId}/add-citizen/${citizenId}`;
  const res = await fetch(url, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Kunne ikke tilføje borger til klasse");
  return res.json();
};

export const fetchCitizenById = async (citizenId: number) => {
  const url = `${BASE_URL}/citizens/${citizenId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunne ikke hente borger");
  return res.json();
};

/**
 * @param classId
 * @returns
 * an organisation object
 */
export const fetchOrganisationFromClassRequest = async (classId: number) => {
  if (classId === null) {
    throw new Error("FATAL FEJL: Klasse-ID er ikke korrekt initialiseret i din session.");
  }

  const url = `${BASE_URL}/organizations/grades/${classId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunne ikke hente organisation");
  return res.json();
};

export const removeCitizenFromClassRequest = async (citizenId: number, classId: number) => {
  console.log("Api citizen ID" + citizenId + " classId " + classId);
  const url = `${BASE_URL}/grades/${classId}/remove-citizen/${citizenId}`;
  const res = await fetch(url, {
    method: "DELETE",
  });
  if (res.status === 500) throw new Error("Der er muligvis server problemer");
};