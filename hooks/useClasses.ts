import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCitizenToClassRequest,
  createNewClassRequest,
  fetchCitizenById,
  fetchOrganisationFromClassRequest,
  removeCitizenFromClassRequest,
} from "../apis/classAPI";
import { CitizenDTO, FullOrgDTO } from "./useOrganisation";

export type ClassDTO = {
  id: number;
  name: string;
  citizens: CitizenDTO[];
};
export default function useClasses(classId: number) {
  const queryClient = useQueryClient();
  const queryKey = [classId, "Classes"];

  const fetchOrganisationWithClass = useQuery<FullOrgDTO>({
    queryFn: async () => fetchOrganisationFromClassRequest(classId),
    queryKey,
  });

  const addCitizenToClass = useMutation({
    mutationFn: (citizenId: number) => addCitizenToClassRequest(citizenId, classId),
    onMutate: async (citizenId: number) => {
      await queryClient.cancelQueries({ queryKey });

      const previousClass = queryClient.getQueryData<FullOrgDTO>(queryKey);
      const citizen = await fetchCitizenById(citizenId);

      queryClient.setQueryData<FullOrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            grades: oldData.grades.map((grade) => {
              if (grade.id === classId) {
                return {
                  ...grade,
                  citizens: [...grade.citizens, citizen],
                };
              }
              return grade;
            }),
          };
        }
        return previousClass;
      });

      return { previousClass };
    },
  });

  const removeCitizenFromClass = useMutation({
    mutationFn: async (citizenId: number) => removeCitizenFromClassRequest(citizenId, classId),
    onMutate: async (citizenId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousOrg = queryClient.getQueryData<FullOrgDTO>(queryKey);
      queryClient.setQueryData<FullOrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            grades: oldData.grades.map((grade) => {
              if (grade.id === classId) {
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
    addCitizenToClass,
    removeCitizenFromClass,
    createNewClassRequest,
    data: fetchOrganisationWithClass.data,
    error: fetchOrganisationWithClass.error,
    isLoading: fetchOrganisationWithClass.isLoading,
  };
}
