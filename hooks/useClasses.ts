import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCitizenToClassRequest,
  createNewClassRequest,
  fetchCitizenById,
  fetchClassRequest,
  removeCitizenFromClassRequest,
} from "../apis/classAPI";
import { CitizenDTO } from "./useOrganisation";

export type ClassDTO = {
  id: number;
  name: string;
  citizens: CitizenDTO[];
};
export default function useClasses(classId: number) {
  const queryClient = useQueryClient();
  const queryKey = [classId, "Classes"];

  const fetchClass = useQuery({
    queryFn: async () => fetchClassRequest(classId),
    queryKey,
  });

  const addCitizenToClass = useMutation({
    mutationFn: (citizenId: number) => addCitizenToClassRequest(citizenId, classId),
    onMutate: async (citizenId: number) => {
      const newCitizen: CitizenDTO = await fetchCitizenById(citizenId);
      await queryClient.cancelQueries({ queryKey });

      const previousClass = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (oldData: { citizens: CitizenDTO[] }) => {
        if (oldData) {
          return {
            ...oldData,
            citizens: [
              {
                ...newCitizen,
                id: -1,
              },
              ...oldData.citizens,
            ],
          };
        }
        return previousClass;
      });
    },
  });

  const removeCitizenFromClass = useMutation({
    mutationFn: async (citizenId: number) => removeCitizenFromClassRequest(citizenId, classId),
    onMutate: async (citizenId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousClass = queryClient.getQueryData<ClassDTO>(queryKey);
      queryClient.setQueryData<ClassDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            citizens: oldData.citizens.filter((citizen) => citizen.id !== citizenId),
          };
        }
        return previousClass;
      });
    },
    onError: (_error, _citizenId, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context);
      }
    },
  });

  return {
    data: fetchClass.data,
    error: fetchClass.error,
    isLoading: fetchClass.isLoading,
    addCitizenToClass,
    removeCitizenFromClass,
    createNewClassRequest,
  };
}

export function useClassCreate(orgId: number) {
  const queryClient = useQueryClient();
  const queryKey = [orgId, "Classes"];
  const createClass = useMutation({
    mutationFn: async (className: string) => createNewClassRequest(className, orgId),
    onMutate: async (className) => {
      await queryClient.cancelQueries({ queryKey });

      const previousClasses = queryClient.getQueryData<ClassDTO[]>(queryKey);
      const newClassId = previousClasses ? previousClasses.length + 1 : 1;
      const newClass: ClassDTO = {
        id: newClassId,
        name: className,
        citizens: [],
      };

      queryClient.setQueryData<ClassDTO[]>(queryKey, (oldData) => {
        if (oldData) {
          return [...oldData, newClass];
        }
        return [newClass];
      });

      return { previousClasses };
    },
    onError: (_error, _className, context) => {
      if (context?.previousClasses) {
        queryClient.setQueryData(queryKey, context.previousClasses);
      }
    },
  });

  return {
    createClass,
  };
}
