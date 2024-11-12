import { CitizenDTO } from "./citizenDTO";

export type ClassDTO = {
  id: number;
  name: string;
  citizens: CitizenDTO[];
};
