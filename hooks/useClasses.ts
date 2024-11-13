import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCitizenToClassRequest, fetchCitizenById, fetchClassRequest } from "../apis/classAPI";
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

  return {
    data: fetchClass.data,
    error: fetchClass.error,
    isLoading: fetchClass.isLoading,
    addCitizenToClass,
  };
}
