import { OrgOverviewDTO } from "../hooks/useOrganisationOverview";
import { BASE_URL } from "../utils/globals";

export const fetchAllOrganisationsRequest = async (userId: string) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  const url = `${BASE_URL}/organizations/user/${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fejl: Kunne ikke hente dine organisationer");
  return res.json();
};

export const deleteOrganisationRequest = async (userId: string | null, organisationId: number) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }
  //Do so only the owner can delete the organisation Implement with auth
  if (userId !== null) {
    throw new Error("Fejl: Kun ejeren af organisationen kan slette den");
  }

  const url = `${BASE_URL}/organizations/${organisationId}`;
  const res = await fetch(url, {
    method: "DELETE",
  });
  if (res.status === 500) throw new Error("Fejl: Der er muligvis server problemer");
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
  if (!res.ok) throw new Error("Fejl: Kunne ikke oprette organisation");
  return res.json();
};
