import { BASE_URL } from "../utils/globals";
import { ChangePasswordDTO, UpdateProfileDTO, DeleteUserDTO } from "../hooks/useProfile";
import axios from "axios";

export const fetchProfileRequest = async (userId: string | null) => {
  if (userId === null) {
    return "FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.";
  }

  const url = `${BASE_URL}/users/${userId}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke hente din profil";
  }
};

export const updateProfileRequest = async (userId: string | null, data: UpdateProfileDTO) => {
  if (userId === null) {
    return "FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.";
  }

  try {
    const res = await axios.put(`${BASE_URL}/users/${userId}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    if (res.status !== 200) {
      return "Fejl: Kunne ikke opdatere din profil";
    }
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke opdatere din profil";
  }
};

export const changePasswordRequest = async (userId: string | null, data: ChangePasswordDTO) => {
  if (userId === null) {
    return "FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.";
  }

  try {
    const res = await axios.put(`${BASE_URL}/users/${userId}/change-password`, data, {
      headers: { "Content-Type": "application/json" },
    });
    if (res.status !== 200) {
      return "Fejl: Kunne ikke opdatere din adgangskode";
    }
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke opdatere din adgangskode";
  }
};

export const deleteUserRequest = async (userId: string | null, data: DeleteUserDTO) => {
  if (userId === null) {
    return "FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.";
  }

  try {
    const res = await axios.delete(`${BASE_URL}/users/${userId}`, {
      data,
      headers: { "Content-Type": "application/json" },
    });
    if (res.status !== 200) {
      return "Fejl: Kunne ikke slette din konto";
    }
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke slette din konto";
  }
};

export const uploadProfileImageRequest = async (userId: string | null, imageUri: string | null) => {
  if (userId === null) {
    return "FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.";
  }

  if (imageUri === null) {
    return "FATAL FEJL: Billede er ikke korrekt initialiseret.";
  }

  const imageData = {
    uri: imageUri,
    type: "image/jpeg",
    name: "profile.jpg",
  };

  const formData = new FormData();
  formData.append("image", imageData as unknown as Blob);

  try {
    const res = await axios.post(`${BASE_URL}/users/setProfilePicture?userId=${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.status !== 200) {
      return "Fejl: Kunne ikke uploade profilbillede";
    }
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke uploade profilbillede";
  }
};
