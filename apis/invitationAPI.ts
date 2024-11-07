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

export async function getInvitationById(id: number) {
    const res = await fetch(`${BASE_URL}/invitations/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!res.ok) throw new Error("Ugyldig invitation");
    return res.json();
}

export async function getInvitationsByOrg(orgId: number) {
    const res = await fetch(`${BASE_URL}/invitations/org/${orgId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!res.ok) throw new Error("Ugyldige organisation invitationer");
    return res.json();
}

export async function createInvitation(orgId: number, receiverEmail: string, senderId: string) {
    const newInvitation = { OrganizationId: orgId, receiverEmail, senderId };
    console.log(newInvitation);
    
    const res = await fetch(`${BASE_URL}/invitations/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInvitation),
    });

    if (!res.ok) throw new Error("Kunne ikke oprette invitation");
    return res.json();
}

export async function respondToInvitation(id: number, response: boolean) {
    const res = await fetch(`${BASE_URL}/invitations/respond/${id}?response=${response}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!res.ok) throw new Error("Kunne ikke svare på invitation");
    return res.json();
}

export async function deleteInvitation(id: number) {
    const res = await fetch(`${BASE_URL}/invitations/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!res.ok) throw new Error("Kunne ikke slette invitation");
    return res.json();
}
