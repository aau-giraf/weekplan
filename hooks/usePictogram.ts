import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllPictogramsByOrg, deletePictogram, uploadNewPictogram } from "../apis/pictogramAPI";

export type Pictogram = {
  id: number;
  organizationId: number | null;
  pictogramName: string;
  pictogramUrl: string;
};

export default function usePictogram(organizationId: number) {
  const queryKey = ["pictograms", organizationId];
  const pageSize = 20;
  const queryClient = useQueryClient();

  const fetchAllPictrograms = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => fetchAllPictogramsByOrg(organizationId, pageSize, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.length === 0) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  const deletePicto = useMutation({
    mutationFn: async (id: number) => deletePictogram(id),
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

  /**
   * Takes a `FormData` object as input and
   * calls the `uploadNewPictogram` function to perform the upload.
   *
   * ```typescript
   * const formData = new FormData();
   * formData.append('image', fileInput.files[0], 'image.png');
   * formData.append('organizationId', '1');
   * formData.append('pictogramName', 'exampleName');
   * ```
   * @param {FormData} formData - The form data containing the pictogram details.
   * @returns {void}
   */
  const uploadNewPicto = useMutation({
    mutationFn: async (formData: FormData) => uploadNewPictogram(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    fetchAllPictrograms,
    deletePictogram: deletePicto,
    uploadNewPictogram: uploadNewPicto,
  };
}
