export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};
export type Citizen = {
  id: number;
  firstName: string;
  lastName: string;
};
export type OrgDTO = {
  id: number;
  name: string;
  users: User[];
  citizens: Citizen[];
};
