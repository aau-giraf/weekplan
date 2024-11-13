import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthentication } from "../providers/AuthenticationProvider";
import {
  changePasswordRequest,
  fetchProfileRequest,
  updateProfileRequest,
  deleteUserRequest,
} from "../apis/profileAPI";

export type ProfileDTO = {
  email: string;
  firstName: string;
  lastName: string;
};

export type UpdateProfileDTO = Omit<ProfileDTO, "email">;

export type ChangePasswordDTO = {
  oldPassword: string;
  newPassword: string;
};

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

  const changePassword = useMutation({
    mutationFn: async (data: ChangePasswordDTO) => changePasswordRequest(userId, data),
  });

  const deleteUser = useMutation({
    mutationFn: async () => deleteUserRequest(userId),
  });

  return {
    data: fetchProfile.data,
    isLoading: fetchProfile.isLoading,
    isError: fetchProfile.isError,
    updateProfile,
    changePassword,
    deleteUser,
  };
}
