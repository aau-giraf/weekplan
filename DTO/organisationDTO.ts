import { CitizenDTO } from "./citizenDTO";
import { UserDTO } from "./userDTO";

export type OrgDTO = {
  id: number;
  name: string;
  users: UserDTO[];
  citizens: CitizenDTO[];
};
