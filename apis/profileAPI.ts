import { BASE_URL } from "../utils/globals";
import { ChangePasswordDTO, UpdateProfileDTO, DeleteUserDTO } from "../hooks/useProfile";

export const fetchProfileRequest = async (userId: string | null) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }
  const url = `${BASE_URL}/users/${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Kunne ikke hente profildata");
  return res.json();
};

export const updateProfileRequest = async (userId: string | null, data: UpdateProfileDTO) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Kunne ikke opdatere profildata");
};

export const changePasswordRequest = async (userId: string | null, data: ChangePasswordDTO) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  const res = await fetch(`${BASE_URL}/users/${userId}/change-password`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Kunne ikke opdatere adgangskode");
};

export const deleteUserRequest = async (userId: string, data: DeleteUserDTO) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Kunne ikke slette brugeren");
};
