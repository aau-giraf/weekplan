import { BASE_URL } from "../utils/globals";
import axios from "axios";

export const fetchInvitationByUserRequest = async (userId: string) => {
  if (!userId) {
    return "FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.";
  }

  const url = `${BASE_URL}/invitations/user/${userId}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke hente dine invitationer.";
  }
};

export const acceptInvitationRequest = async (invitationId: number, isAccepted: boolean) => {
  const url = `${BASE_URL}/invitations/respond/${invitationId}?response=${isAccepted}`;
  try {
    const res = await axios.put(url, {}, { headers: { "Content-Type": "application/json" } });
    if (res.status !== 200) {
      return "Fejl: Kunne ikke acceptere invitation";
    }
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke acceptere invitation";
  }
};

export const createInvitationRequest = async (orgId: number, receiverEmail: string, senderId: string) => {
  const newInvitation = { organizationId: orgId, receiverEmail, senderId };
  const url = `${BASE_URL}/invitations`;
  try {
    const res = await axios.post(url, newInvitation, { headers: { "Content-Type": "application/json" } });
    if (res.status === 400) return "Fejl: Kunne ikke finde en bruger med den angivne e-mail";
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke oprette invitation";
  }
};
