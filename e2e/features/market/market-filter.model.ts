import { PlayerRole } from "@libs/domain/models/player.model";

export interface MarketFilter {
  role?: PlayerRole;
  rate?: number;
  nationality?: string;
}