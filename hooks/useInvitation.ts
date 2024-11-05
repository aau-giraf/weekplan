import { useAuthentication } from "../providers/AuthenticationProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInvitationByUserRequest } from "../apis/invitationAPI";

export default function useInvitation() {
  const { userId } = useAuthentication();
  const queryClient = useQueryClient();
  const queryKey = [userId!, "Invitation"];

  const fetchByUser = useQuery({
    queryFn: async () => fetchInvitationByUserRequest(userId!),
    queryKey,
    enabled: !!userId,
  });

  return(
    fetchByUser
  )
}