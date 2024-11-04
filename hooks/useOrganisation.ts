import { useQuery } from "@tanstack/react-query";
import { fetchOrgData, fetchUserOrgs } from "../apis/organisationAPI";
import { OrganisationDTO } from "../DTO/organisationDTO";

type UserOrg = {
  id: number;
  name: string;
};

export const useOrganisation = ({
  orgID,
  userID,
}: {
  orgID: number;
  userID: string | null;
}) => {
  const useFetchUserOrgs = useQuery<UserOrg[]>({
    queryFn: async () => fetchUserOrgs(userID),
    queryKey: ["organisations", "List"],
  });

  const useFetchOrgData = useQuery<OrganisationDTO>({
    queryFn: async () => fetchOrgData(orgID),
    queryKey: ["organisations", orgID],
  });

  return {
    useFetchUserOrgs,
    useFetchOrgData,
  };
};
