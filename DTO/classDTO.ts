import { CitizenDTO } from "./citizenDTO";

export type ClassDTO = {
  classId: number;
  name: string;
  citizens: CitizenDTO[];
};
