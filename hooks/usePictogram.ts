import {useQuery} from "@tanstack/react-query";
import {fetchPictograms} from "../apis/pictogramAPI";

export default function usePictogram(id: number) {
    const queryKey = ['pictograms', id];

    const useFetchPictograms = useQuery({
        queryFn: async () => fetchPictograms(27575),
        queryKey: queryKey,
    });

    return {
        useFetchPictograms,
    };
}