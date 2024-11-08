import { OrgOverviewDTO } from "../hooks/useOrganisationOverview";
import { BASE_URL } from "../utils/globals";

export const fetchAllOrganisationsRequest = async (userId: string) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  const url = `${BASE_URL}/organizations/user/${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunne ikke hente dine organisationer");
  return res.json();
};

export const deleteOrganisationRequest = async (organisationId: number) => {
  const url = `${BASE_URL}/organizations/${organisationId}`;
  const res = await fetch(url, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Kunne ikke slette organisation");
};

export const createOrganisationsRequest = async (
  userId: string,
  orgName: string
): Promise<OrgOverviewDTO> => {
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
