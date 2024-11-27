import { axiosInstance } from "./axiosConfig";

export const fetchInvitationByUserRequest = (userId: string) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  return axiosInstance
    .get(`/invitations/user/${userId}`)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med hentning af invitation");
    });
};

export const acceptInvitationRequest = (invitationId: number, isAccepted: boolean) => {
  return axiosInstance
    .put(`/invitations/respond/${invitationId}?response=${isAccepted}`)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med at acceptere invitation");
    });
};

export const createInvitationRequest = (orgId: number, receiverEmail: string, senderId: string) => {
  return axiosInstance
    .post("/invitations", { organizationId: orgId, receiverEmail, senderId })
    .then((res) => res.data)
    .catch((error) => {
      if (error.response) {
        throw new Error(error.message || "Fejl: Der opstod et problem med at oprette invitation");
      }
    });
};
