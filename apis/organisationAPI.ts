import { BASE_URL } from "../utils/globals";

import { OrgDTO } from "../DTO/organisationDTO";

export const fetchAllOrganisationsRequest = async (userId: string) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke initialiseret korrekt i din session.");
  }

  const url = `${BASE_URL}/organizations/user/${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunne ikke hente dine organisationer");
  return res.json();
};

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
  const url = `${BASE_URL}/organizations/${orgId}/add-citizen`;
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
  const url = `${BASE_URL}/organizations/${orgId}/remove-citizen/${citizenId}`;
  const res = await fetch(url, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Kunne ikke slette organisationen");
};

export const createOrganisationsRequest = async (userId: string, orgName: string): Promise<OrgDTO> => {
  const params = new URLSearchParams();
  params.append("id", userId);
  const url = `${BASE_URL}/organizations?${params.toString()}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: orgName }),
  });
  if (!res.ok) throw new Error("Kunne ikke oprette organisation");
  return res.json();
};
