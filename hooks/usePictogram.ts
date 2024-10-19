import { useQuery } from "@tanstack/react-query";
import { fetchPictograms } from "../apis/pictogramAPI";

/**
 *
 * @param id - ID of the pictogram to be fetched
 * @return {useFetchPictograms}
 */
export default function usePictogram(id: number) {
  const queryKey = ["pictograms", id];

  const useFetchPictograms = useQuery({
    queryFn: async () => fetchPictograms(27575),
    queryKey: queryKey,
  });

  return {
    useFetchPictograms,
  };
}
