import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCitizenToGradeRequest,
  createNewGradeRequest,
  fetchCitizenById,
  fetchOrganisationFromGradeRequest,
  removeCitizenFromGradeRequest,
} from "../apis/gradeAPI";
import { CitizenDTO, FullOrgDTO } from "./useOrganisation";

export type GradeDTO = {
  id: number;
  name: string;
  citizens: CitizenDTO[];
};
export default function useGrades(gradeId: number) {
  const queryClient = useQueryClient();
  const queryKey = [gradeId, "Classes"];

  const fetchOrganisationWithGrade = useQuery<FullOrgDTO>({
    queryFn: async () => fetchOrganisationFromGradeRequest(gradeId),
    queryKey,
  });

  const addCitizenToGrade = useMutation({
    mutationFn: (citizenId: number) => addCitizenToGradeRequest(citizenId, gradeId),
    onMutate: async (citizenId: number) => {
      await queryClient.cancelQueries({ queryKey });

      const previousGrade = queryClient.getQueryData<FullOrgDTO>(queryKey);
      const citizen = await fetchCitizenById(citizenId);

      queryClient.setQueryData<FullOrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            grades: oldData.grades.map((grade) => {
              if (grade.id === gradeId) {
                return {
                  ...grade,
                  citizens: [...grade.citizens, citizen],
                };
              }
              return grade;
            }),
          };
        }
        return previousGrade;
      });

      return { previousGrade };
    },
  });

  const removeCitizenFromGrade = useMutation({
    mutationFn: async (citizenId: number) => removeCitizenFromGradeRequest(citizenId, gradeId),
    onMutate: async (citizenId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousOrg = queryClient.getQueryData<FullOrgDTO>(queryKey);
      queryClient.setQueryData<FullOrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            grades: oldData.grades.map((grade) => {
              if (grade.id === gradeId) {
                return {
                  ...grade,
                  citizens: grade.citizens.filter((citizen) => citizen.id !== citizenId),
                };
              }
              return grade;
            }),
          };
        }
        return previousOrg;
      });
    },
    onError: (_error, _citizenId, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context);
      }
    },
  });

  return {
    addCitizenToGrade,
    removeCitizenFromGrade,
    createNewGradeRequest: createNewGradeRequest,
    data: fetchOrganisationWithGrade.data,
    error: fetchOrganisationWithGrade.error,
    isLoading: fetchOrganisationWithGrade.isLoading,
  };
}
