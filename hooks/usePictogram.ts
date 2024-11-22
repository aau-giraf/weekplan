import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllPictogramsByOrg, deletePictogram } from "../apis/pictogramAPI";

export type Pictogram = {
  id: number;
  organizationId: number | null;
  pictogramName: string;
  pictogramUrl: string;
};

export default function usePictogram(organizationId: number) {
  const queryKey = ["pictograms", organizationId];
  const pageSize = 10;
  const queryClient = useQueryClient();

  const fetchAllPictrograms = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => fetchAllPictogramsByOrg(organizationId, pageSize, pageParam),
    getNextPageParam: (lastPage, pages) => pages.length + 1,
    initialPageParam: 1,
  });

  const deletePicto = useMutation({
    mutationFn: async (id: number) => {
      return deletePictogram(id);
    },
    onMutate: async (id) => {
      queryClient.cancelQueries({ queryKey });
      const previousPictograms = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData: any) => ({
        ...oldData,
        pages: oldData.pages.map((page: Pictogram[]) => page.filter((picto) => picto.id !== id)),
      }));

      return { previousPictograms };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousPictograms) {
        queryClient.setQueryData(queryKey, context.previousPictograms as Pictogram[]);
      }
    },
  });

  return {
    fetchAllPictrograms,
    deletePictogram: deletePicto,
  };
}
