import { BASE_URL } from "../utils/globals";

export const createPictogramRequest = async (image: File, organizationId: number, pictogramName: string) => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("organizationId", organizationId.toString());
  formData.append("pictogramName", pictogramName);

  const res = await fetch(`${BASE_URL}/pictograms/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error: Could not create pictogram");
};

export const fetchPictogramRequest = async (PictogramId: number) => {
  const res = await fetch(`${BASE_URL}/pictograms/${PictogramId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Error: Could not fetch pictogram");
  return await res.json();
};

export const fetchPictogramsByOrganizationRequest = async (organizationId: number) => {
  const res = await fetch(`${BASE_URL}/pictograms/${organizationId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Error: Could not fetch pictograms");
  return await res.json();
};

export const deletePictogramRequest = async (PictogramId: number) => {
  const res = await fetch(`${BASE_URL}/pictograms/${PictogramId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error: Could not delete pictogram");
};
