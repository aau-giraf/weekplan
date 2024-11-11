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