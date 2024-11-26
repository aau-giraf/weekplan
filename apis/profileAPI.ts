import { BASE_URL } from "../utils/globals";
import { ChangePasswordDTO, UpdateProfileDTO, DeleteUserDTO } from "../hooks/useProfile";
import axios from "axios";

export const fetchProfileRequest = async (userId: string | null) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  const url = `${BASE_URL}/users/${userId}`;
  const res = await axios.get(url).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Kunne ikke hente din profil");
    }
  });

  if (!res) {
    throw new Error("Fejl: Kunne ikke hente din profil");
  }

  return res.data;
};

export const updateProfileRequest = async (userId: string | null, data: UpdateProfileDTO) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  const res = await axios.put(`${BASE_URL}/users/${userId}`, data).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Kunne ikke opdatere din profil");
    }
  });

  if (!res) {
    throw new Error("Fejl: Kunne ikke opdatere din profil");
  }
};

export const changePasswordRequest = async (userId: string | null, data: ChangePasswordDTO) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  const res = await axios.put(`${BASE_URL}/users/${userId}/change-password`, data).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Kunne ikke opdatere din adgangskode");
    }
  });

  if (!res) {
    throw new Error("Fejl: Kunne ikke opdatere din adgangskode");
  }
};

export const deleteUserRequest = async (userId: string | null, data: DeleteUserDTO) => {
  if (userId === null) {
    throw new Error("FATAL FEJL: Bruger-ID er ikke korrekt initialiseret i din session.");
  }

  return await axios
    .delete(`${BASE_URL}/users/${userId}`, {
      data,
      headers: { "Content-Type": "application/json" },
    })
    .catch((error) => {
      if (error.response) {
        throw new Error(error.response.data?.message || "Fejl: Kunne ikke slette din konto");
      }
    });
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
  formData.append("image", imageData as unknown as Blob);

  const res = await axios
    .post(`${BASE_URL}/users/setProfilePicture?userId=${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .catch((error) => {
      if (error.response) {
        throw new Error(error.message || "Fejl: Kunne ikke uploade profilbillede");
      }
    });

  if (!res) {
    throw new Error("Fejl: Kunne ikke uploade profilbillede");
  }
};
