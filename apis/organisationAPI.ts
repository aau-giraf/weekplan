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

export const removeUserFromOrg = async (orgId: number, userId: string) => {
  const url = `${BASE_URL}/organizations/${orgId}/remove-user/${userId}`;
  const res = await fetch(url, { method: "PUT" });

  if (!res.ok) throw new Error("Kunne ikke fjerne bruger", { cause: res.status });
};

export const deleteCitizenRequest = async (orgId: number, citizenId: number) => {
  const url = `${BASE_URL}/citizens/${orgId}/remove-citizen/${citizenId}`;
  const res = await fetch(url, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Kunne ikke slette organisationen");
};

export const deleteMemberRequest = async (orgId: number, memberId: string) => {
  const url = `${BASE_URL}/organizations/${orgId}/remove-user/${memberId}`;
  const res = await fetch(url, {
    method: "put",
  });

  if (!res.ok) throw new Error("Kunne ikke slette medlemmet");
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

  if(!res.ok) throw new Error("Kunne ikke opdatere borger");
}