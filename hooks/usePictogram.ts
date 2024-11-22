import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllPictogramsByOrg } from "../apis/pictogramAPI";

export type Pictogram = {
  id: number;
  organizationId: number | null;
  pictogramName: string;
  pictogramUrl: string;
};

export default function usePictogram(organizationId: number) {
  const queryKey = ["pictograms", organizationId];
  const pageSize = 10;

  const fetchAllPictrograms = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => fetchAllPictogramsByOrg(organizationId, pageSize, pageParam),
    getNextPageParam: (lastPage, pages) => pages.length + 1,
    initialPageParam: 1,
  });

  return {
    fetchAllPictrograms,
  };
}
