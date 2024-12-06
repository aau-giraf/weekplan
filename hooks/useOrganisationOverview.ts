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

/**
 * Custom hook to manage the organisation overview data. Provides functionalities to fetch, delete, and create organisations.
 * Utilizes React Query for state management and caching.
 *
 * @returns {Object} - A set of utilities and state for managing organisation overviews.
 * @returns {OrgOverviewDTO[] | undefined} data - The list of organisations fetched from the server.
 * @returns {boolean} isLoading - Indicates whether the data is currently being loaded.
 * @returns {boolean} isError - Indicates whether an error occurred during the data fetch.
 * @returns {boolean} isSuccess - Indicates whether the data fetch was successful.
 * @returns {Function} refetch - A function to manually refetch the organisation data.
 * @returns {Object} createOrganisation - Mutation to create a new organisation.
 * @returns {Object} deleteOrganisation - Mutation to delete an existing organisation.
 */
const useOrganisationOverview = () => {
  const { userId } = useAuthentication();
  const queryClient = useQueryClient();
  const queryKey = [userId!, "OrganisationOverview"];

  /**
   * Fetches all organisations for the currently authenticated user.
   * Uses React Query's `useQuery` to handle caching, loading states, and error handling.
   */
  const fetchOrgOverview = useQuery<OrgOverviewDTO[]>({
    queryFn: async () => fetchAllOrganisationsRequest(userId!),
    queryKey,
    enabled: !!userId, // Fetch only if userId exists.
  });

  /**
   * Deletes an organisation by its ID. Uses React Query's `useMutation` to handle the deletion process,
   * including optimistic updates to the cache.
   */
  const deleteOrganisation = useMutation({
    mutationFn: (orgId: number) => deleteOrganisationRequest(orgId),
    onMutate: async (orgId) => {
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous organisation list for rollback in case of failure.
      const previousOrgs = queryClient.getQueryData<OrgOverviewDTO[]>(queryKey);

      // Optimistically update the cache by removing the organisation.
      queryClient.setQueryData<OrgOverviewDTO[]>(queryKey, (oldData) =>
        (oldData || []).filter((org) => org.id !== orgId)
      );

      return previousOrgs;
    },
    onError: (_error, _orgId, context) => {
      // Rollback the cache to the previous state in case of an error.
      if (context) {
        queryClient.setQueryData(queryKey, context);
      }
    },
    onSettled: () => {
      // Refetch the organisation list after the mutation is settled.
      queryClient.invalidateQueries({ queryKey });
    },
  });

  /**
   * Creates a new organisation with the specified name. Uses React Query's `useMutation` to handle
   * the creation process, including optimistic updates to the cache.
   */
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
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
