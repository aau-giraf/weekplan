import { Pictogram } from "../hooks/usePictogram";
import { BASE_URL } from "../utils/globals";

export const fetchAllPictogramsByOrg = async (
  organizationId: number,
  pageSize: number,
  pageNumber: number
): Promise<Pictogram[]> => {
  const params = new URLSearchParams();
  params.append("organizationId", organizationId.toString());
  params.append("currentPage", pageNumber.toString());
  params.append("pageSize", pageSize.toString());

  const url = `${BASE_URL}/pictograms/organizationId:int?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch pictograms");
  return response.json();
};

export const deletePictogram = async (pictogramId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/pictograms/${pictogramId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete pictogram");
  return response.json();
};

export const fetchPictogram = async (pictogramId: number): Promise<Pictogram> => {
  const response = await fetch(`${BASE_URL}/pictograms/${pictogramId}`);
  if (!response.ok) throw new Error("Failed to fetch pictogram");
  return response.json();
};

export const uploadNewPictogram = async (formData: FormData): Promise<void> => {
  const res = await fetch(`${BASE_URL}/pictograms`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error: Could not create pictogram");
};
