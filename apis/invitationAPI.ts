import { BASE_URL } from "../utils/globals";

export const fetchInvitationByUserRequest = async (userId: string) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  const url = `${BASE_URL}/invitations/user/${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunne ikke hente dine invitationer");
  return res.json();
};

export const acceptInvitationRequest = async (invitationId: number, isAccepted: boolean) => {
  const url = `${BASE_URL}/invitations/respond/${invitationId}?response=${isAccepted}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Kunne ikke acceptere invitation");
};
