import { Club } from "@/features/club/models/club.model";

export interface AuthSession {
  club: Club;
  token: string;
}

export interface Token {
  managerId: string;
  clubId: string;
  exp: number;
}