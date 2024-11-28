import { Pictogram } from "../hooks/usePictogram";
import { axiosInstance } from "./axiosConfig";

export const fetchAllPictogramsByOrg = (
  organizationId: number,
  pageSize: number,
  pageNumber: number
): Promise<Pictogram[]> => {
  return axiosInstance
    .get(`/pictograms/organizationId:int`, {
      params: {
        organizationId: organizationId,
        currentPage: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    })
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med at hente piktogrammer");
    });
};

export const deletePictogram = (pictogramId: number): Promise<void> => {
  return axiosInstance
    .delete(`/pictograms/${pictogramId}`)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med at slette piktogrammet");
    });
};

export const uploadNewPictogram = (formData: FormData): Promise<void> => {
  return axiosInstance
    .post(`/pictograms`, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    })
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der opstod et problem med at oprette piktogrammet");
    });
};
