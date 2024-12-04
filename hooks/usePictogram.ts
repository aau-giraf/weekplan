import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePictogram, fetchAllPictogramsByOrg, uploadNewPictogram } from "../apis/pictogramAPI";

export type Pictogram = {
  id: number;
  organizationId: number | null;
  pictogramName: string;
  pictogramUrl: string;
};

/**
 * Custom hook to manage pictograms associated with a specific organization. Provides functionality for:
 * - Fetching pictograms in a paginated manner.
 * - Deleting a pictogram.
 * - Uploading a new pictogram.
 *
 * @param {number} organizationId - The ID of the organization for which pictograms are managed.
 * @returns {Object} An object containing functions and query results for managing pictograms.
 */
export default function usePictogram(organizationId: number) {
  const queryKey = ["pictograms", organizationId];
  const pageSize = 20;
  const queryClient = useQueryClient();

  /**
   * Fetches pictograms for the organization in a paginated manner.
   *
   * Uses the `useInfiniteQuery` hook to manage infinite scrolling or loading more pictograms as needed.
   *
   * @type {UseInfiniteQueryResult<Pictogram[], unknown>}
   */
  const fetchAllPictrograms = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => fetchAllPictogramsByOrg(organizationId, pageSize, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.length === 0) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  /**
   * Deletes a pictogram by its ID and updates the cache optimistically.
   *
   * @type {UseMutationResult<void, unknown, number, { previousPictograms: Pictogram[] }>}
   */
  const deletePicto = useMutation({
    mutationFn: async (id: number) => deletePictogram(id),
    onMutate: async (id) => {
      // Cancel any ongoing queries for pictograms.
      queryClient.cancelQueries({ queryKey });

      // Retrieve the previous state of pictograms from the cache.
      const previousPictograms = queryClient.getQueryData(queryKey);

      // Optimistically update the cache to remove the deleted pictogram.
      queryClient.setQueryData(queryKey, (oldData: any) => ({
        ...oldData,
        pages: oldData.pages.map((page: Pictogram[]) => page.filter((picto) => picto.id !== id)),
      }));

      return { previousPictograms }; // Return the previous state for rollback if needed.
    },
    onError: (_error, _variables, context) => {
      // Rollback to the previous state in case of an error.
      if (context?.previousPictograms) {
        queryClient.setQueryData(queryKey, context.previousPictograms as Pictogram[]);
      }
    },
  });

  /**
   * Uploads a new pictogram to the server. Expects a `FormData` object with the following structure:
   *
   * ```typescript
   * const formData = new FormData();
   * formData.append('image', fileInput.files[0], 'image.png');
   * formData.append('organizationId', '1');
   * formData.append('pictogramName', 'exampleName');
   * ```
   *
   * On successful upload, invalidates the pictogram query to refresh the cache.
   *
   * @type {UseMutationResult<void, unknown, FormData, unknown>}
   * @param {FormData} formData - The form data containing the pictogram details.
   * @returns {void}
   */
  const uploadNewPicto = useMutation({
    mutationFn: async (formData: FormData) => uploadNewPictogram(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }), // Refresh the pictogram cache.
  });

  return {
    fetchAllPictrograms,
    deletePictogram: deletePicto,
    uploadNewPictogram: uploadNewPicto,
  };
}
