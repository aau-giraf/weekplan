import { ActivityDTO } from "./activityDTO";

export type CitizenDTO = {
  id: number;
  firstName: string;
  lastName: string;
  activities: ActivityDTO[];
};
