import { Manager } from "./manager.model";

export interface Club {
  id: string;
  name: string;
  managerId: Manager['id'];
  passwordEncrypted: string;
  balance: number;
  createdAt: number;
}