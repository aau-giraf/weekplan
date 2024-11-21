import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthentication } from "../providers/AuthenticationProvider";
import {
  createOrganisationsRequest,
  deleteOrganisationRequest,
  fetchAllOrganisationsRequest,
} from "../apis/organisationOverviewAPI";

export type OrgOverviewDTO = {
  id: number;
  name: string;
};

const useOrganisationOverview = () => {
  const { userId } = useAuthentication();
  const queryClient = useQueryClient();
  const queryKey = [userId!, "OrganisationOverview"];

  const fetchOrgOverview = useQuery<OrgOverviewDTO[]>({
    queryFn: async () => fetchAllOrganisationsRequest(userId!),
    queryKey,
    enabled: !!userId,
  });

  const deleteOrganisation = useMutation({
    mutationFn: (orgId: number) => deleteOrganisationRequest(orgId),
    onMutate: async (orgId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousOrgs = queryClient.getQueryData<OrgOverviewDTO[]>(queryKey);
      queryClient.setQueryData<OrgOverviewDTO[]>(queryKey, (oldData) => {
        return oldData?.filter((org) => org.id !== orgId);
      });

      return previousOrgs;
    },
    onError: (_error, _deleted, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context);
      }
    },
  });

  const createOrganisation = useMutation({
    mutationFn: (orgName: string) => createOrganisationsRequest(userId!, orgName),
    onMutate: async (newOrgName) => {
      await queryClient.cancelQueries({ queryKey });

      const previousOrgs = queryClient.getQueryData<OrgOverviewDTO[]>(queryKey);
      queryClient.setQueryData<OrgOverviewDTO[]>(queryKey, (oldData) => [
        ...(oldData || []),
        { name: newOrgName, id: -1 },
      ]);

      return previousOrgs;
    },
    onError: (_error, _newOrg, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context);
      }
    },
    onSuccess: (data, _variables, _context) => {
      queryClient.setQueryData<OrgOverviewDTO[]>(queryKey, (oldData) =>
        (oldData || []).map((org) => (org.id === -1 ? { ...org, id: data.id } : org))
      );
    },
  });

  return {
    data: fetchOrgOverview.data,
    isLoading: fetchOrgOverview.isLoading,
    isError: fetchOrgOverview.isError,
    isSuccess: fetchOrgOverview.isSuccess,
    refetch: fetchOrgOverview.refetch,
    createOrganisation,
    deleteOrganisation,
  };
};

export default useOrganisationOverview;
