import { Club } from "../../../shared/models/club.model";

export interface Manager {
  id: string;
  name: string;
  clubId: Club['id'];
  createdAt: number;
}