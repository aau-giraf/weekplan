import { Pictogram } from "../hooks/usePictogram";
import { BASE_URL } from "../utils/globals";
import axios from "axios";

export const fetchAllPictogramsByOrg = async (
  organizationId: number,
  pageSize: number,
  pageNumber: number
): Promise<Pictogram[]> => {
  const params = {
    organizationId: organizationId.toString(),
    currentPage: pageNumber.toString(),
    pageSize: pageSize.toString(),
  };

  const url = `${BASE_URL}/pictograms/organizationId:int`;

  const res = await axios.get(url, { params }).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med at hente piktogrammer");
    }
  });

  if (!res) {
    throw new Error("Fejl: Der opstod et problem med at hente piktogrammer");
  }

  return res.data;
};

export const deletePictogram = async (pictogramId: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/pictograms/${pictogramId}`, {
    method: "DELETE",
  }).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med at slette piktogrammet");
    }
  });

  if (!res) {
    throw new Error("Fejl: Der opstod et problem med at slette piktogrammet");
  }
};

export const uploadNewPictogram = async (formData: FormData): Promise<void> => {
  const res = await fetch(`${BASE_URL}/pictograms`, {
    method: "POST",
    body: formData,
  }).catch((error) => {
    if (error.response) {
      throw new Error(error.message || "Fejl: Der opstod et problem med at oprette piktogrammet");
    }
  });

  if (!res) {
    throw new Error("Fejl: Der opstod et problem med at oprette piktogrammet");
  }
};
