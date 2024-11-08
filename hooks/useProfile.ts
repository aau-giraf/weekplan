import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthentication } from "../providers/AuthenticationProvider";
import { fetchProfileRequest, updateProfileRequest } from "../apis/profileAPI";

export type ProfileDTO = {
  email: string;
  firstName: string;
  lastName: string;
};

export type UpdateProfileDTO = Omit<ProfileDTO, "email">;

export default function useProfile() {
  const { userId } = useAuthentication();
  const queryClient = useQueryClient();

  const fetchProfile = useQuery<ProfileDTO>({
    queryFn: async () => fetchProfileRequest(userId),
    queryKey: [userId, "Profile"],
    enabled: !!userId,
  });

  const updateProfile = useMutation({
    mutationFn: async (data: UpdateProfileDTO) => updateProfileRequest(userId, data),
    onMutate: async (data) => {
      console.log(data);
      const { firstName, lastName } = data;
      await queryClient.cancelQueries({ queryKey: [userId, "Profile"] });
      queryClient.setQueryData<UpdateProfileDTO>([userId, "Profile"], {
        firstName,
        lastName,
      });

      return {
        previousData: queryClient.getQueryData<ProfileDTO>([userId, "Profile"]),
      };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData<UpdateProfileDTO>([userId, "Profile"], context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userId, "Profile"] });
    },
  });

  return {
    data: fetchProfile.data,
    isLoading: fetchProfile.isLoading,
    isError: fetchProfile.isError,
    updateProfile,
  };
}
