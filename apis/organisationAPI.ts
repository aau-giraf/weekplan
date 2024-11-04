import { BASE_URL } from "../utils/globals";

export const fetchUserOrgs = async (id: string | null) => {
  const res = await fetch(`${BASE_URL}/organizations/user/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Fejl ${res.status}: Organization ikke fundet`);
  }
  return await res.json();
};

export const fetchOrgData = async (id: number) => {
  const res = await fetch(`${BASE_URL}/organizations/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Fejl ${res.status}: Organization ikke fundet`);
  }
  return await res.json();
};
