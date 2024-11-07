import { useAuthentication } from "../providers/AuthenticationProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createInvitation, deleteInvitation, fetchInvitationByUserRequest, respondToInvitation } from "../apis/invitationAPI";

type Invitation = {
  id: number;
  orgId: number;
  receiverEmail: string;
  senderId: string;
};

export default function useInvitation() {
  const { userId } = useAuthentication();
  const queryClient = useQueryClient();
  const queryKey = [userId!, "Invitation"];

  const fetchByUser = useQuery({
    queryFn: async () => fetchInvitationByUserRequest(userId!),
    queryKey,
    enabled: !!userId,
  });
  
  const useCreateInvitation = useMutation({
    mutationFn: (variables: { orgId: number; receiverEmail: string; senderId: string }) =>
        createInvitation(variables.orgId, variables.receiverEmail, variables.senderId),

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
  
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
  

  return{
    fetchByUser,
    useCreateInvitation,
    useDeleteInvitation,
    useRespondToInvitation,
    data: fetchByUser.data,
    isLoading: fetchByUser.isLoading,
    isError: fetchByUser.isError,
  }
}