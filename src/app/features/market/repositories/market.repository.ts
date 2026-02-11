import { StorageService } from "@/core/services/storage.service";
import { ClubRepositoryService } from '@/features/club/repositories/club.repository';
import { PlayerRepository } from '@/shared/repositories/player.repository';
import { HttpParams } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { BuyPlayerResponse } from "../models/buy-player-response.model";
import { MarketTransaction } from '../models/market-transaction.model';
import { Player } from "@libs/domain/models/player.model";
import { MarketFilter } from "../models/market-filter.model";
import { matchesFilter, matchesMarketPlayerFilter } from "@/shared/utils/filter.utils";
import { MarketPlayersResponse } from "../models/market-players-response.model";

@Injectable({
  providedIn: 'root'
})
export class MarketRepository {
  private readonly _STORAGE_KEY = 'NG_CLUB_MANAGER_MARKET_TRANSACTION_LIST';;
  private readonly _storageService = inject<StorageService<MarketTransaction[]>>(StorageService);
  private readonly playerRepository = inject(PlayerRepository);

  private readonly _marketList = this.playerRepository.marketPlayerList;
  private readonly _marketTransactions = signal<MarketTransaction[]>([])
  private readonly clubRepository = inject(ClubRepositoryService);


  constructor() {
    effect(() => {
      this._storageService.setValue(this._STORAGE_KEY, this._marketTransactions());
    });
  }

  getPlayersForSale(
    filter: MarketFilter
  ): MarketPlayersResponse {
    const { offset, limit, ...playerFieldFilters } = filter;
    const startIndex = +(offset ?? 0);
    const endIndex = startIndex + +(limit ?? 50);

    const filteredPlayers = this._marketList().filter(player => matchesMarketPlayerFilter(player, playerFieldFilters))
    const players = [...filteredPlayers].slice(startIndex, endIndex);
    const ratings = this._marketList().map(p => p.rating);
    return {
      players,
      playersCount: this._marketList().length,
      rating: {
        min: Math.min(...ratings),
        max: Math.max(...ratings),
      }
    };
  }

  buyPlayer(player: Player, clubId: string): BuyPlayerResponse {
    const club = this.clubRepository.findById(clubId)!;
    this.clubRepository.update({ ...club, balance: (club.balance - player.price) })
    this.playerRepository.update({ clubId });
    return {
      clubName: club.name,
      playerFullName: player.fullName,
      price: player.price,
    };
  }
}