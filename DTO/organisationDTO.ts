export type OrganisationDTO = {
  id: number;
  name: string;
  classes: ClassDTO[];
};

export type UserDTO = {
  id: number;
  firstName: string | undefined;
  lastName: string | undefined;
  image: string | undefined;
};

export type ClassDTO = {
  id: number;
  name: string;
  members: UserDTO[];
};
