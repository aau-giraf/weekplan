import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPictogramRequest,
  fetchPictogramRequest,
  fetchPictogramsByOrganizationRequest,
  deletePictogramRequest,
} from "../apis/pictogramAPI";

export type PictogramDTO = {
  id: number;
  organizationId: number | null;
  pictogramName: string;
  pictogramUrl: string;
};

export default function usePictogram({ PictogramId }: { PictogramId: number }) {
  const queryClient = useQueryClient();
  const queryKey = ["pictograms", PictogramId];

  const useFetchPictograms = useQuery<PictogramDTO[]>({
    queryKey,
    queryFn: () => fetchPictogramsByOrganizationRequest(PictogramId),
  });

  const useCreatePictogram = useMutation({
    mutationFn: (variables: { image: File; pictogramName: string }) =>
      createPictogramRequest(variables.image, PictogramId, variables.pictogramName),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousPictograms = queryClient.getQueryData<PictogramDTO[]>(queryKey);

      queryClient.setQueryData<PictogramDTO[]>(queryKey, (oldData) => [
        ...(oldData || []),
        {
          id: PictogramId,
          organizationId: -1,
          pictogramName: variables.pictogramName,
          pictogramUrl: "",
        },
      ]);

      return { previousPictograms };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPictograms) {
        queryClient.setQueryData<PictogramDTO[]>(queryKey, context.previousPictograms);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const useDeletePictogram = useMutation({
    mutationFn: (pictogramId: number) => deletePictogramRequest(pictogramId),
    onMutate: async (pictogramId: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousPictograms = queryClient.getQueryData<PictogramDTO[]>(queryKey);

      queryClient.setQueryData<PictogramDTO[]>(
        queryKey,
        (oldData) => oldData?.filter((p) => p.id !== pictogramId) || []
      );

      return { previousPictograms };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPictograms) {
        queryClient.setQueryData<PictogramDTO[]>(queryKey, context.previousPictograms);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const useFetchPictogram = (pictogramId: number) =>
    useQuery<PictogramDTO>({
      queryKey: ["pictogram", pictogramId],
      queryFn: () => fetchPictogramRequest(pictogramId),
    });

  return {
    useFetchPictograms,
    useCreatePictogram,
    useDeletePictogram,
    useFetchPictogram,
  };
}
