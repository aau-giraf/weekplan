import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClassRequest } from "../apis/classAPI";
export default function useClasses(classId: number) {
  const queryClient = useQueryClient();
  const queryKey = [classId, "Classes"];

  const fetchClass = useQuery({
    queryFn: async () => fetchClassRequest(classId),
    queryKey,
  });

  return { data: fetchClass.data, error: fetchClass.error, isLoading: fetchClass.isLoading };
}
