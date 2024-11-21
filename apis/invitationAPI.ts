import { BASE_URL } from "../utils/globals";

export const fetchInvitationByUserRequest = async (userId: string) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  const url = `${BASE_URL}/invitations/user/${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fejl: Kunne ikke hente dine invitationer");
  return res.json();
};

export const acceptInvitationRequest = async (invitationId: number, isAccepted: boolean) => {
  const url = `${BASE_URL}/invitations/respond/${invitationId}?response=${isAccepted}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Fejl: Kunne ikke acceptere invitation");
};

export const createInvitationRequest = async (orgId: number, receiverEmail: string, senderId: string) => {
  const newInvitation = { organizationId: orgId, receiverEmail, senderId };
  const url = `${BASE_URL}/invitations`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newInvitation),
  });
  if (res.status === 400) throw new Error("Fejl: Kunne ikke finde en bruger med den angivne email");
  if (!res.ok) throw new Error("Fejl: Kunne ikke oprette invitation");
};
