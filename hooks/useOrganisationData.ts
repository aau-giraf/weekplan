import { useQuery } from "@tanstack/react-query";
import { OrganisationDTO } from "../DTO/organisationDTO";
import { fetchOrganisationRequest } from "../apis/organisationAPI";

export const useOrganisationData = (orgId: number) => {
  const fetchOrganisationData = useQuery<OrganisationDTO>({
    queryFn: async () => fetchOrganisationRequest(orgId!),
    queryKey: ["Organisation", orgId],
  });

  return { fetchOrganisationData };
};
