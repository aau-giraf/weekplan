import { ActivityDTO, FullActivityDTO } from './activityDTO';

export type OrganisationDTO = {
  id: number;
  name: string;
  users: MemberDTO[];
  citizens: CitizenDTO[];
};

export type MemberDTO = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
};

export type CitizenDTO = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  organizations: any | null;
  activities: FullActivityDTO | null;
};
