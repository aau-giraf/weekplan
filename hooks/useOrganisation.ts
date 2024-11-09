import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCitizenRequest,
  deleteCitizenRequest,
  fetchOrganisationRequest,
} from "../apis/organisationAPI";
import { Citizen, OrgDTO } from "../DTO/organisationDTO";

const useOrganisation = (orgId: number) => {
  const queryClient = useQueryClient();
  const queryKey = [orgId, "Organisation"];

  const fetchOrganisation = useQuery<OrgDTO>({
    queryFn: async () => fetchOrganisationRequest(orgId),
    queryKey,
  });

  const createCitizen = useMutation<number, Error, Omit<Citizen, "id">>({
    mutationFn: (citizen: Omit<Citizen, "id">) =>
      createCitizenRequest(citizen.firstName, citizen.lastName, orgId),
    onMutate: async (newCitizen) => {
      await queryClient.cancelQueries({ queryKey });

      const previousOrg = queryClient.getQueryData<OrgDTO>(queryKey);
      queryClient.setQueryData<OrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            citizens: [
              {
                id: -1,
                ...newCitizen,
              },
              ...oldData.citizens,
            ],
          };
        }
        return previousOrg;
      });
    },
    onError: (_error, _newCitizen, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context);
      }
    },
    onSuccess: (actualId, _variables, _context) => {
      queryClient.setQueryData<OrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            citizens: oldData.citizens.map((citizen) => {
              if (citizen.id === -1) {
                return {
                  id: actualId,
                  firstName: citizen.firstName,
                  lastName: citizen.lastName,
                };
              }
              return citizen;
            }),
          };
        }
        return oldData;
      });
    },
  });

  const deleteCitizen = useMutation<void, Error, number>({
    mutationFn: (citizenId: number) => deleteCitizenRequest(orgId, citizenId),
    onMutate: async (citizenId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousOrg = queryClient.getQueryData<OrgDTO>(queryKey);
      queryClient.setQueryData<OrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            citizens: oldData.citizens.filter((citizen) => citizen.id !== citizenId),
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
    data: fetchOrganisation.data,
    isLoading: fetchOrganisation.isLoading,
    refetch: fetchOrganisation.refetch,
    error: fetchOrganisation.error,
    createCitizen,
    deleteCitizen,
  };
};

export default useOrganisation;
