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

  try {
    const res = await axios.get(url, { params });
    return res.data;
  } catch (error: any) {
    const errorMessage = error.message || "Ukendt fejl opstod";
    throw new Error(`Failed to fetch pictograms. Details: ${errorMessage}`);
  }
};

export const deletePictogram = async (pictogramId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/pictograms/${pictogramId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete pictogram");
  return response.json();
};

export const uploadNewPictogram = async (formData: FormData): Promise<void> => {
  const res = await fetch(`${BASE_URL}/pictograms`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error: Could not create pictogram");
};
