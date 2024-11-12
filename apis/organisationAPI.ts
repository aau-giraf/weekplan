import { BASE_URL } from "../utils/globals";

export const fetchOrganisationRequest = async (organisationId: number) => {
  const url = `${BASE_URL}/organizations/${organisationId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunne ikke hente data for organisationen");
  return res.json();
};

export const createCitizenRequest = async (
  firstname: string,
  lastName: string,
  orgId: number
): Promise<number> => {
  const url = `${BASE_URL}/citizens/${orgId}/add-citizen`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName: firstname, lastName: lastName }),
  });
  if (!res.ok) throw new Error("Kunne ikke oprette borger");
  return res.json();
};

export const deleteCitizenRequest = async (orgId: number, citizenId: number) => {
  const url = `${BASE_URL}/citizens/${orgId}/remove-citizen/${citizenId}`;
  const res = await fetch(url, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Kunne ikke slette organisationen");
};
