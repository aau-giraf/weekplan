import { BASE_URL } from "../utils/globals";

export const fetchInvitationByUserRequest = async (userId: string) => {
  if (userId === null) {
    throw new Error(
      "FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session."
    );
  }

  const url = `${BASE_URL}/invitations/user/${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunne ikke hente dine invitationer");
  return res.json();
};