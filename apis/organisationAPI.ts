import { BASE_URL } from "../utils/globals";

export const fetchOrganisationRequest = async (organisationId: number) => {
  const url = `${BASE_URL}/organizations/${organisationId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fejl: Kunne ikke hente data for organisationen");
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
  if (!res.ok) throw new Error("Fejl: Kunne ikke oprette borger");
  return res.json();
};

export const deleteCitizenRequest = async (orgId: number, citizenId: number) => {
  const url = `${BASE_URL}/citizens/${orgId}/remove-citizen/${citizenId}`;
  const res = await fetch(url, {
    method: "DELETE",
  });

  if (res.status === 500) throw new Error("Fejl: Der er muligvis server problemer");
};

export const deleteMemberRequest = async (orgId: number, memberId: string) => {
  const url = `${BASE_URL}/organizations/${orgId}/remove-user/${memberId}`;
  const res = await fetch(url, {
    method: "put",
  });

  if (res.status === 500) throw new Error("Fejl: Der er muligvis server problemer");
};

export const updateCitizenRequest = async (citizenId: number, firstName: string, lastName: string) => {
  const url = `${BASE_URL}/citizens/${citizenId}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName }),
  });

  if (!res.ok) throw new Error("Fejl: Kunne ikke opdatere borger");
};
