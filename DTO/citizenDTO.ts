import { ActivityDTO } from "./activityDTO";
import { OrgDTO } from "./organisationDTO";

export type CitizenDTO = {
    citizenId: number;
    firstName: string;
    lastName: string;
    organisationId: OrgDTO;
    activities: ActivityDTO[];
};