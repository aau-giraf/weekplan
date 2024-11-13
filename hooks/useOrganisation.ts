import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCitizenRequest,
  deleteCitizenRequest,
  deleteMemberRequest,
  fetchOrganisationRequest,
  updateCitizenRequest,
} from "../apis/organisationAPI";
import { OrgDTO } from "../DTO/organisationDTO";
import { CitizenDTO } from "../DTO/citizenDTO";

const useOrganisation = (orgId: number) => {
  const queryClient = useQueryClient();
  const queryKey = [orgId, "Organisation"];

  const fetchOrganisation = useQuery<OrgDTO>({
    queryFn: async () => fetchOrganisationRequest(orgId),
    queryKey,
  });

  const createCitizen = useMutation<number, Error, Omit<CitizenDTO, "id">>({
    mutationFn: (citizen: Omit<CitizenDTO, "id">) =>
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

  const deleteMember = useMutation<void, Error, string>({
    mutationFn: (memberId: string) => deleteMemberRequest(orgId, memberId),
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousOrg = queryClient.getQueryData<OrgDTO>(queryKey);
      queryClient.setQueryData<OrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            users: oldData.users.filter((user) => user.id.toString() !== memberId.toString()),
          };
        }
        return previousOrg;
      });
    },
    onError: (_error, _memberId, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context);
      }
    },
  });

  const updateCitizen = useMutation<void, Error, CitizenDTO>({
    mutationFn: (citizen) =>
      updateCitizenRequest(Number(citizen.id), citizen.firstName, citizen.lastName),
    onMutate: async (newCitizen) => {
      newCitizen.id = Number(newCitizen.id);

      const previousOrg = queryClient.getQueryData<OrgDTO>(queryKey);
      console.log("Previous data:", previousOrg);

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<OrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          const updatedCitizens = oldData.citizens.map((citizen) =>
            citizen.id === newCitizen.id ? newCitizen : citizen
          );
          console.log("Updated citizens:", updatedCitizens); // Log updated citizens list
          return { ...oldData, citizens: updatedCitizens };
        }
        return previousOrg;
      });
    },
    onError: (_error, _newCitizen, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context);
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    data: fetchOrganisation.data,
    isLoading: fetchOrganisation.isLoading,
    refetch: fetchOrganisation.refetch,
    error: fetchOrganisation.error,
    createCitizen,
    deleteCitizen,
    deleteMember,
    updateCitizen,
  };
};

export default useOrganisation;
