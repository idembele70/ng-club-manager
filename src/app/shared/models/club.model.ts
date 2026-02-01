import { Manager } from "../../features/dashboard/models/manager.model";

export interface Club {
  id: string;
  name: string;
  managerId: Manager['id'];
  passwordEncrypted: string;
  balance: number;
  createdAt: number;
  abbreviation: string;
}