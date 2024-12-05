import { ChangePasswordDTO, UpdateProfileDTO, DeleteUserDTO } from "../hooks/useProfile";
import { axiosInstance } from "./axiosConfig";

export const fetchProfileRequest = async (userId: string | null) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  return await axiosInstance
    .get(`/users/${userId}`)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke hente din profil");
    });
};

export const updateProfileRequest = (userId: string | null, data: UpdateProfileDTO) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  return axiosInstance
    .put(`/users/${userId}`, data)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke opdatere din profil");
    });
};

export const changePasswordRequest = (userId: string | null, data: ChangePasswordDTO) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  return axiosInstance
    .put(`/users/${userId}/change-password`, data)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke opdatere din adgangskode");
    });
};

export const deleteUserRequest = (userId: string | null, data: DeleteUserDTO) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  return axiosInstance
    .delete(`/users/${userId}`, { data })
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke slette din konto");
    });
};

export const uploadProfileImageRequest = (userId: string | null, imageUri: string | null) => {
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
  formData.append("image", imageData as unknown as Blob);

  return axiosInstance
    .post(`/users/setProfilePicture?userId=${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data)
    .catch((error) => {
      if (error.response) {
        throw new Error(error.message || "Fejl: Kunne ikke uploade profilbillede");
      }
    });
};
