import { BASE_URL } from "../utils/globals";
import { ChangePasswordDTO, UpdateProfileDTO, DeleteUserDTO } from "../hooks/useProfile";

export const fetchProfileRequest = async (userId: string | null) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }
  const url = `${BASE_URL}/users/${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fejl: Kunne ikke hente din profil");
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
  if (!res.ok) throw new Error("Fejl: Kunne ikke opdatere din profil");
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
  if (!res.ok) throw new Error("Fejl: Kunne ikke opdatere din adgangskode");
};

export const deleteUserRequest = async (userId: string | null, data: DeleteUserDTO) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Fejl: Kunne ikke slette din konto");
};

export const uploadProfileImageRequest = async (userId: string | null, imageUri: string | null) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  if (imageUri === null) {
    throw new Error("FATAL FEJL: Billede er ikke korrekt initialiseret.");
  }

  const imageData = {
    uri: imageUri,
    type: "image/jpeg",
    name: "profile.jpg",
  };

  const formData = new FormData();

  //TypeScript doesn't this format, so we need to typecast it
  formData.append("image", imageData as unknown as Blob);

  const res = await fetch(`${BASE_URL}/users/setProfilePicture?userId=${userId}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Fejl: Kunne ikke uploade profilbillede");
};
