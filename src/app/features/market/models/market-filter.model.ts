import { PlayerRole } from "@libs/domain/models/player.model";

export interface MarketFilter {
  limit?: number;
  offset?: number;
  role?: PlayerRole;
  minRating?: number;
  maxRating?: number;
}
