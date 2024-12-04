import { useAuthentication } from "../providers/AuthenticationProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptInvitationRequest,
  createInvitationRequest,
  fetchInvitationByUserRequest,
} from "../apis/invitationAPI";

export default function useInvitation() {
  const { userId } = useAuthentication();
  const queryClient = useQueryClient();
  const queryKey = [userId!, "Invitation"];

  /**
   * Query to fetch invitations by the current user.
   */
  const fetchByUser = useQuery({
    queryFn: async () => fetchInvitationByUserRequest(userId!),
    queryKey,
    enabled: !!userId, // Ensure the query only runs if `userId` exists
  });

  /**
   * Mutation to accept or reject an invitation.
   *
   * @param {Object} variables - Variables for the mutation.
   * @param {number} variables.invitationId - The ID of the invitation.
   * @param {boolean} variables.isAccepted - Whether the invitation is accepted or rejected.
   */
  const acceptInvitation = useMutation({
    mutationFn: ({ invitationId, isAccepted }: { invitationId: number; isAccepted: boolean }) =>
      acceptInvitationRequest(invitationId, isAccepted),

    onMutate: async ({ invitationId }) => {
      await queryClient.cancelQueries({ queryKey });

      // Store the previous state before making optimistic updates
      const previousInvitations = queryClient.getQueryData(queryKey);

      // Optimistically update the invitations by filtering out the accepted/rejected invitation
      queryClient.setQueryData(queryKey, (oldData: any) =>
        oldData.filter((invitation: any) => invitation.id !== invitationId)
      );

      return { previousInvitations };
    },

    onError: (_error, _variables, context) => {
      // Rollback the state in case of an error
      if (context?.previousInvitations) {
        queryClient.setQueryData(queryKey, context.previousInvitations);
      }
    },

    onSuccess: () => {
      // Invalidate related queries, e.g., organisation overview
      queryClient.invalidateQueries({ queryKey: [userId, "OrganisationOverview"] });
    },
  });

  /**
   * Mutation to create a new invitation.
   *
   * @param {Object} variables - Variables for the mutation.
   * @param {number} variables.orgId - The ID of the organisation sending the invitation.
   * @param {string} variables.receiverEmail - The email of the receiver.
   * @param {string} variables.senderId - The ID of the user sending the invitation.
   */
  const createInvitation = useMutation({
    mutationFn: async (variables: { orgId: number; receiverEmail: string; senderId: string }) =>
      createInvitationRequest(variables.orgId, variables.receiverEmail, variables.senderId),
  });

  return {
    fetchByUser, // Query to fetch invitations
    acceptInvitation, // Mutation to accept/reject invitations
    createInvitation, // Mutation to create a new invitation
    isSuccess: fetchByUser.isSuccess, // Status of the fetch query
  };
}
