import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCitizenToGradeRequest,
  createNewGradeRequest,
  fetchCitizenById,
  fetchOrganisationFromGradeRequest,
  removeCitizenFromGradeRequest,
  updateGradeRequest,
} from "../apis/gradeAPI";
import { CitizenDTO, FullOrgDTO } from "./useOrganisation";

export type GradeDTO = {
  id: number;
  name: string;
  citizens: CitizenDTO[];
};
export default function useGrades(gradeId: number) {
  const queryClient = useQueryClient();
  const queryKey = [gradeId, "Grades"];

  const fetchOrganisationWithGrade = useQuery<FullOrgDTO>({
    queryFn: async () => fetchOrganisationFromGradeRequest(gradeId),
    queryKey,
  });

  const addCitizenToGrade = useMutation({
    mutationFn: (citizenIds: number[]) => addCitizenToGradeRequest(citizenIds, gradeId),
    onMutate: async (citizenIds: number[]) => {
      await queryClient.cancelQueries({ queryKey });

      const previousGrade = queryClient.getQueryData<FullOrgDTO>(queryKey);
      const citizens = await Promise.all(citizenIds.map((id) => fetchCitizenById(id)));

      queryClient.setQueryData<FullOrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            grades: oldData.grades.map((grade) => {
              if (grade.id === gradeId) {
                return {
                  ...grade,
                  citizens: [...grade.citizens, ...citizens],
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
    onError: (_error, _citizenIds, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context.previousGrade);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeCitizenFromGrade = useMutation({
    mutationFn: async (citizenIds: number[]) => removeCitizenFromGradeRequest(citizenIds, gradeId),
    onMutate: async (citizenIds: number[]) => {
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
                  citizens: grade.citizens.filter((citizen) => !citizenIds.includes(citizen.id)),
                };
              }
              return grade;
            }),
          };
        }
        return previousOrg;
      });

      return { previousOrg };
    },
    onError: (_error, _citizenIds, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context.previousOrg);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateGrade = useMutation({
    mutationFn: (gradeName: string) => updateGradeRequest(gradeId, gradeName),
    onMutate: async (gradeName: string) => {
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
                  name: gradeName,
                };
              }
              return grade;
            }),
          };
        }
        return previousOrg;
      });

      return { previousOrg };
    },
    onError: (_error, _gradeName, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context.previousOrg);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    addCitizenToGrade,
    removeCitizenFromGrade,
    updateGrade,
    createNewGradeRequest: createNewGradeRequest,
    data: fetchOrganisationWithGrade.data,
    error: fetchOrganisationWithGrade.error,
    isLoading: fetchOrganisationWithGrade.isLoading,
  };
}
