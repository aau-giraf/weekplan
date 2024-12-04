import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthentication } from "../providers/AuthenticationProvider";
import {
  changePasswordRequest,
  deleteUserRequest,
  fetchProfileRequest,
  updateProfileRequest,
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

export type DeleteUserDTO = {
  password: string;
  id: string;
};

/**
 * Custom hook to manage user profile actions, including fetching the profile,
 * updating profile information, changing the password, and deleting the user account.
 * @returns {Object} Object containing methods and state for profile management:
 * - `data`: Profile data fetched from the server.
 * - `isLoading`: Indicates if the profile data is loading.
 * - `isError`: Indicates if there was an error fetching the profile.
 * - `updateProfile`: Mutation for updating the profile.
 * - `changePassword`: Mutation for changing the user's password.
 * - `deleteUser`: Mutation for deleting the user account.
 */
export default function useProfile() {
  const { userId } = useAuthentication(); // Retrieves the authenticated user's ID.
  const queryClient = useQueryClient(); // React Query's query client for managing cache.

  /**
   * Query to fetch the user's profile information.
   * The query is enabled only if `userId` exists.
   */
  const fetchProfile = useQuery<ProfileDTO>({
    queryFn: async () => fetchProfileRequest(userId),
    queryKey: [userId, "Profile"],
    enabled: !!userId,
  });

  /**
   * Mutation to update the user's profile information.
   * This mutation uses optimistic updates to modify the cache before the server confirms the change.
   */
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

  /**
   * Mutation to change the user's password.
   * @mutationFn Function to send the `ChangePasswordDTO` to the server.
   */
  const changePassword = useMutation({
    mutationFn: async (data: ChangePasswordDTO) => changePasswordRequest(userId, data),
  });

  /**
   * Mutation to delete the user account.
   * @mutationFn Function to send the `DeleteUserDTO` to the server for account deletion.
   */
  const deleteUser = useMutation({
    mutationFn: async (data: DeleteUserDTO) => deleteUserRequest(userId, data),
  });

  return {
    data: fetchProfile.data, // Fetched profile data.
    isLoading: fetchProfile.isLoading, // Loading state for fetching profile data.
    isError: fetchProfile.isError, // Error state for fetching profile data.
    updateProfile, // Mutation for updating the profile.
    changePassword, // Mutation for changing the user's password.
    deleteUser, // Mutation for deleting the user account.
  };
}
