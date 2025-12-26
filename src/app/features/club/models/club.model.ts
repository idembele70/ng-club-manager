import { Manager } from "./manager.model";

export interface Club {
  id: string;
  name: string;
  managerId: Manager['id'];
  passwordEncrypted: string;
  balance: number;
  createdAt: number;
}

export interface ClubAuthSession {
  club: Club;
  token: string;
}

export interface CreateClubPayload {
  clubName: string;
  managerName: string;
  password: string;
}

export interface ClubLoginPayload {
  managerOrClubName: string;
  password: string;
}

export interface Token {
  managerId: string;
  clubId: string;
  exp: number;
}