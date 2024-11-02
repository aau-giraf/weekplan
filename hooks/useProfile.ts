import { useQuery } from "@tanstack/react-query";
import { useAuthentication } from "../providers/AuthenticationProvider";
import { fetchProfileRequest } from "../apis/profileAPI";

type ProfileDTO = {
  email: string;
  firstName: string;
  lastName: string;
};

const useProfile = () => {
  const { userId } = useAuthentication();
  const fetchProfile = useQuery<ProfileDTO>({
    queryFn: async () => fetchProfileRequest(userId),
    queryKey: [userId],
    enabled: !!userId,
  });
  return {
    data: fetchProfile.data,
    isLoading: fetchProfile.isLoading,
    isError: fetchProfile.isError,
  };
};

export default useProfile;
