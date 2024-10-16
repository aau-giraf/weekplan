import {useQuery} from "@tanstack/react-query";
import {fetchPictograms} from "../apis/pictogramAPI";

export default function usePictogram() {
    const queryKey = ['pictograms'];

    const useFetchPictograms = useQuery({
        queryFn: fetchPictograms,
        queryKey: queryKey,
    });

    return {
        useFetchPictograms,
    };
}