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

  const fetchByUser = useQuery({
    queryFn: async () => fetchInvitationByUserRequest(userId!),
    queryKey,
    enabled: !!userId,
  });

  const acceptInvitation = useMutation({
    mutationFn: ({ invitationId, isAccepted }: { invitationId: number; isAccepted: boolean }) =>
      acceptInvitationRequest(invitationId, isAccepted),

    onMutate: async ({ invitationId, isAccepted }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousInvitations = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData: any) =>
        oldData.filter((invitation: any) => invitation.id !== invitationId)
      );

      return { previousInvitations };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousInvitations) {
        queryClient.setQueryData(queryKey, context.previousInvitations);
      }
    },
  });

  const createInvitation = useMutation({
    mutationFn: async ({
      orgId,
      receiverEmail,
      senderId,
    }: {
      orgId: number;
      receiverEmail: string;
      senderId: string;
    }) => createInvitationRequest(orgId, receiverEmail, senderId),
  });

  return {
    fetchByUser,
    acceptInvitation,
    createInvitation,
    isSuccess: fetchByUser.isSuccess,
  };
}
