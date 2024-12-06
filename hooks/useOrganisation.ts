import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCitizenRequest,
  deleteCitizenRequest,
  deleteMemberRequest,
  fetchOrganisationRequest,
  updateCitizenRequest,
  updateOrganisationRequest,
} from "../apis/organisationAPI";

import { ActivityDTO } from "./useActivity";
import { GradeDTO } from "./useGrades";
import { createNewGradeRequest } from "../apis/gradeAPI";

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type CitizenDTO = {
  id: number;
  firstName: string;
  lastName: string;
  activities: ActivityDTO[];
};

export type OrgDTO = {
  id: number;
  name: string;
  users: UserDTO[];
  citizens: CitizenDTO[];
};

export type FullOrgDTO = {
  id: number;
  name: string;
  users: UserDTO[];
  citizens: CitizenDTO[];
  grades: GradeDTO[];
};

/**
 * Hook for managing organisation data, including fetching, creating, updating,
 * and deleting resources such as citizens, members, and grades.
 * @param orgId - The ID of the organisation to manage.
 * @returns Object containing various utilities for managing the organisation.
 */
const useOrganisation = (orgId: number) => {
  const queryClient = useQueryClient();
  const queryKey = [orgId, "Organisation"];

  /**
   * Fetch the full details of the organisation, including users, citizens, and grades.
   */
  const fetchOrganisation = useQuery<FullOrgDTO>({
    queryFn: async () => fetchOrganisationRequest(orgId),
    queryKey,
  });

  /**
   * Create a new citizen within the organisation.
   * Optimistically updates the UI to include the new citizen.
   */
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
                id: -1, // Temporary ID until the server responds.
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
            citizens: oldData.citizens.map((citizen) =>
              citizen.id === -1
                ? {
                    id: actualId,
                    firstName: citizen.firstName,
                    lastName: citizen.lastName,
                    activities: citizen.activities,
                  }
                : citizen
            ),
          };
        }
        return oldData;
      });
    },
  });

  /**
   * Delete a citizen from the organisation.
   * Optimistically updates the UI by removing the citizen immediately.
   */
  const deleteCitizen = useMutation({
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

  /**
   * Delete a member (user) from the organisation.
   * Optimistically updates the UI by removing the member immediately.
   */
  const deleteMember = useMutation<void, Error, string>({
    mutationFn: async (memberId: string) => {
      await deleteMemberRequest(orgId, memberId);
    },
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousOrg = queryClient.getQueryData<OrgDTO>(queryKey);
      queryClient.setQueryData<OrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            users: oldData.users.filter((user) => user.id !== memberId),
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

  /**
   * Update an existing citizen in the organisation.
   * Optimistically updates the UI with new citizen details.
   */
  const updateCitizen = useMutation<void, Error, Omit<CitizenDTO, "activities">>({
    mutationFn: async (citizen) => {
      await updateCitizenRequest(Number(citizen.id), citizen.firstName, citizen.lastName);
    },
    onMutate: async (newCitizen) => {
      const previousOrg = queryClient.getQueryData<OrgDTO>(queryKey);
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<OrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          const updatedCitizens = oldData.citizens.map((citizen) =>
            citizen.id === newCitizen.id ? { ...citizen, ...newCitizen } : citizen
          );
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

  /**
   * Update the organisation's name.
   * Optimistically updates the UI with the new organisation name.
   */
  const updateOrganisation = useMutation<void, Error, { name: string }>({
    mutationFn: async ({ name }) => {
      await updateOrganisationRequest(orgId, name);
    },
    onMutate: async ({ name }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousOrg = queryClient.getQueryData<OrgDTO>(queryKey);
      queryClient.setQueryData<OrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            name,
          };
        }
        return previousOrg;
      });
    },
    onError: (_error, { name }, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context);
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  /**
   * Create a new grade for the organisation.
   * Optimistically updates the UI to include the new grade.
   */
  const createGrade = useMutation({
    mutationFn: async (gradeName: string) => createNewGradeRequest(gradeName, orgId),
    onMutate: async (gradeName) => {
      await queryClient.cancelQueries({ queryKey });

      const previousOrg = queryClient.getQueryData<FullOrgDTO>(queryKey);

      const newGrade: GradeDTO = {
        id: -1,
        name: gradeName,
        citizens: [],
      };

      queryClient.setQueryData<FullOrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            grades: [...oldData.grades, newGrade],
          };
        }
        return previousOrg;
      });
      return { previousOrg };
    },
    onError: (_error, _gradeName, context) => {
      if (context?.previousOrg) {
        queryClient.setQueryData(queryKey, context.previousOrg);
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
    updateOrganisation,
    createGrade,
  };
};

export default useOrganisation;
