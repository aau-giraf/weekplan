import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCitizenRequest,
  deleteCitizenRequest,
  deleteMemberRequest,
  fetchOrganisationRequest,
  makeAdminRequest,
  removeAdminRequest,
  updateCitizenRequest,
  updateOrganisationRequest,
} from "../apis/organisationAPI";

import { ActivityDTO } from "./useActivity";
import { GradeDTO } from "./useGrades";
import { createNewGradeRequest, deleteGradeRequest } from "../apis/gradeAPI";

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "OrgOwner" | "OrgAdmin" | "OrgMember";
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
const useOrganisation = (orgId: number) => {
  const queryClient = useQueryClient();
  const queryKey = [orgId, "Organisation"];

  const fetchOrganisation = useQuery<FullOrgDTO>({
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
                  activities: citizen.activities,
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

  const updateCitizen = useMutation<void, Error, Omit<CitizenDTO, "activities">>({
    mutationFn: async (citizen) => {
      await updateCitizenRequest(Number(citizen.id), citizen.firstName, citizen.lastName);
    },
    onMutate: async (newCitizen) => {
      newCitizen.id = Number(newCitizen.id);

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

  const createGrade = useMutation({
    mutationFn: async (gradeName: string) => createNewGradeRequest(gradeName, orgId),
    onMutate: async (gradeName) => {
      await queryClient.cancelQueries({ queryKey: queryKey });

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

  const deleteGrade = useMutation({
    mutationFn: async (gradeId: number) => {
      await deleteGradeRequest(gradeId, orgId);
    },
    onMutate: async (gradeId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousOrg = queryClient.getQueryData<FullOrgDTO>(queryKey);
      queryClient.setQueryData<FullOrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            grades: oldData.grades.filter((grade) => grade.id !== gradeId),
          };
        }
        return previousOrg;
      });
      return { previousOrg };
    },
    onError: (_error, _gradeId, context) => {
      if (context?.previousOrg) {
        queryClient.setQueryData(queryKey, context.previousOrg);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const makeMemberAdmin = useMutation({
    mutationFn: async (userId: string) => {
      await makeAdminRequest(orgId, userId);
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousOrg = queryClient.getQueryData<FullOrgDTO>(queryKey);
      queryClient.setQueryData<FullOrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            users: oldData.users.map((user) => {
              if (user.id === userId) {
                return { ...user, role: "OrgAdmin" };
              }
              return user;
            }),
          };
        }
        return previousOrg;
      });
      return { previousOrg };
    },
    onError: (_error, _userId, context) => {
      if (context?.previousOrg) {
        queryClient.setQueryData(queryKey, context.previousOrg);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeAdmin = useMutation({
    mutationFn: async (userId: string) => {
      await removeAdminRequest(orgId, userId);
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousOrg = queryClient.getQueryData<FullOrgDTO>(queryKey);
      queryClient.setQueryData<FullOrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            users: oldData.users.map((user) => {
              if (user.id === userId) {
                return { ...user, role: "OrgMember" };
              }
              return user;
            }),
          };
        }
        return previousOrg;
      });
      return { previousOrg };
    },
    onError: (_error, _userId, context) => {
      if (context?.previousOrg) {
        queryClient.setQueryData(queryKey, context.previousOrg);
      }
    },
    onSuccess: () => {
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
    deleteGrade,
    makeMemberAdmin,
    removeAdmin,
  };
};

export default useOrganisation;
