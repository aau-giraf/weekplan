import { BASE_URL } from "../utils/globals";
import axios from "axios";

export const fetchInvitationByUserRequest = async (userId: string) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  const url = `${BASE_URL}/invitations/user/${userId}`;
  const res = await axios.get(url).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med hentning af invitation");
    }
  });

  if (!res) {
    throw new Error("Fejl: Der opstod et problem med hentning af invitation");
  }

  return res.data;
};

export const acceptInvitationRequest = async (invitationId: number, isAccepted: boolean) => {
  const url = `${BASE_URL}/invitations/respond/${invitationId}?response=${isAccepted}`;
  const res = await axios.put(url, {}).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med at acceptere invitation");
    }
  });

  if (!res) {
    throw new Error("Fejl: Der opstod et problem med at acceptere invitation");
  }
};

export const createInvitationRequest = async (orgId: number, receiverEmail: string, senderId: string) => {
  const newInvitation = { organizationId: orgId, receiverEmail, senderId };
  const url = `${BASE_URL}/invitations`;
  const res = await axios.post(url, newInvitation).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med at oprette invitation");
    }
  });

  if (!res) {
    throw new Error("Fejl: Der opstod et problem med at oprette invitation");
  }
};
