import { Player } from "@libs/domain/models/player.model";

export interface MarketPlayersResponse {
  players: Player[];
  playersCount: number;
  rating: {
    min: number;
    max: number;
  }
}
