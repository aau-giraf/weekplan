import { BASE_URL } from "../utils/globals";

export const fetchProfileRequest = async (userId: string | null) => {
  if (userId === null) {
    throw new Error(
      "FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session."
    );
  }
  const url = `${BASE_URL}/users/${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunne ikke hente profildata");
  return res.json();
};
