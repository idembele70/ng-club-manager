import { Club } from "./club.model";

export interface Manager {
  id: string;
  name: string;
  clubId: Club['id'];
}