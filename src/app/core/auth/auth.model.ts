import { Club } from "@/features/dashboard/models/club.model";

export interface AuthSession {
  club: Club;
  token: string;
}

export interface RegisterPayload {
  clubName: string;
  managerName: string;
  password: string;
}

export interface LoginPayload {
  managerOrClubName: string;
  password: string;
}

export interface Token {
  managerId: string;
  clubId: string;
  exp: number;
}