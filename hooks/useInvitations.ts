import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createInvitation, deleteInvitation, fetchInvitationByUserRequest, respondToInvitation } from '../apis/invitationAPI';

type Invitation = {
    id: number;
    orgId: number;
    receiverId: string;
    senderId: string;
}



export const useInvitation = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const queryKey = ["invitations", userId];

  const useFetchInvitations = useQuery<Invitation>({
    queryFn: () => fetchInvitationByUserRequest(userId),
    queryKey,
  });

  const useCreateInvitation = useMutation({
    mutationFn: (variables: { orgId: number; receiverId: string; senderId: string }) =>
        createInvitation(variables.orgId, variables.receiverId, variables.senderId),

    onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey });
        const previousInvitations = queryClient.getQueryData(queryKey);
        queryClient.setQueryData<Invitation[]>(queryKey, (oldData) => [
            ...(oldData || []),
            { ...variables, id: -1 },
        ]);
        return { previousInvitations };
    },

    onError: (_error, _variables, context) => {
        if (context?.previousInvitations) {
          queryClient.setQueryData(queryKey, context.previousInvitations);
        }
      },  

    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });


  const useDeleteInvitation = useMutation({
    mutationFn: (id: number) => deleteInvitation(id),
    onMutate: async (id: number) => {
        await queryClient.cancelQueries({ queryKey });
        const previousInvitations = queryClient.getQueryData(queryKey);

        queryClient.setQueryData<Invitation[]>(queryKey, (oldData) =>
            (oldData || []).filter((invitation) => invitation.id !== id) || []
        );
        return {previousInvitations}
    },

    onError: (_error, _variables, context) => {
        if (context?.previousInvitations) {
            queryClient.setQueryData(queryKey, context.previousInvitations);
        }
    },
  });

  const useRespondToInvitation = useMutation({
    mutationFn: (variables: { id: number; response: boolean }) =>
        respondToInvitation(variables.id, variables.response),

    onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey });
        const previousInvitations = queryClient.getQueryData(queryKey);
        queryClient.setQueryData<Invitation[]>(queryKey, (oldData) =>
            (oldData || []).map((invitation) =>
                invitation.id === variables.id
                    ? { ...invitation, id: -1 }
                    : invitation
            ) || []
        );
        return { previousInvitations };
    },

    onError: (_error, _variables, context) => {
        if (context?.previousInvitations) {
            queryClient.setQueryData(queryKey, context.previousInvitations);
        }
    },

    onSuccess: () => queryClient.invalidateQueries({ queryKey }),

  });

  return {
    invalidateQueries: () => queryClient.invalidateQueries({ queryKey }),
    data: useFetchInvitations.data,
    useFetchInvitations,
    useCreateInvitation,
    useRespondToInvitation,
    useDeleteInvitation,
    isLoading: useFetchInvitations.isLoading,
    isError: useFetchInvitations.isError,
  };
}
