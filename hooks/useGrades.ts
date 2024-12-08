import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCitizenToGradeRequest,
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
    mutationFn: ({ citizenIds, orgId }: { citizenIds: number[]; orgId: number }) =>
      addCitizenToGradeRequest(citizenIds, gradeId, orgId),
    onMutate: async ({ citizenIds }: { citizenIds: number[] }) => {
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
    mutationFn: async ({ citizenIds, orgId }: { citizenIds: number[]; orgId: number }) =>
      removeCitizenFromGradeRequest(citizenIds, gradeId, orgId),
    onMutate: async ({ citizenIds }: { citizenIds: number[] }) => {
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
    mutationFn: ({ gradeName, orgId }: { gradeName: string; orgId: number }) =>
      updateGradeRequest(gradeId, gradeName, orgId),
    onMutate: async ({ gradeName }: { gradeName: string }) => {
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
    data: fetchOrganisationWithGrade.data,
    error: fetchOrganisationWithGrade.error,
    isLoading: fetchOrganisationWithGrade.isLoading,
  };
}
