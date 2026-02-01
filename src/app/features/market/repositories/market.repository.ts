import { JwtUtilities } from './../../../core/utilities/jwt.utilities';
import { ClubRepositoryService } from '@/features/dashboard/repositories/club.repository';
import { StorageService } from "@/core/services/storage.service";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { Player } from "../models/player.model";
import { createPlayer } from "../factories/player.factory";
import { MarketFilter } from "../models/market-filter.model";
import { HttpParams } from "@angular/common/http";
import { BuyPlayerResponse } from "../models/buy-player-response.model";
import { PlayerRepository } from './player.repository';
import { MarketTransaction } from '../models/market-transaction.model';

@Injectable({
  providedIn: 'root'
})
export class MarketRepository {
  private readonly _STORAGE_KEY = 'NG_CLUB_MANAGER_MARKET_TRANSACTION_LIST';;
  private readonly _storageService = inject<StorageService<MarketTransaction[]>>(StorageService);

  private readonly playerRepository = inject(PlayerRepository);
  private readonly _marketList = computed<Player[]>(() =>
    this.playerRepository.playerList().filter(p => !p.clubId)
  );
  private readonly _marketTransactions = signal<MarketTransaction[]>([])
  private readonly clubRepository = inject(ClubRepositoryService);


  constructor() {
    effect(() => {
      this._storageService.setValue(this._STORAGE_KEY, this._marketTransactions());
    });
  }

    getPlayersForSale(httpParams: HttpParams): { players: Player[], playersCount: number } {
      const startIndex = +(httpParams.get('offset') ?? 0);
      const endIndex = startIndex + +(httpParams.get('limit') ?? 50);
      const players = [...this._marketList()].slice(startIndex, endIndex);
      return { players, playersCount: this._marketList().length };
    }

    buyPlayer(player: Player, clubId: string): BuyPlayerResponse {
      const club = this.clubRepository.findById(clubId)!;
      this.clubRepository.update({ ...club, balance: (club.balance - player.price) })
      this.playerRepository.update({clubId });
      return {
        clubName: club.name,
        playerFullName: player.fullName,
        price: player.price,
      };
    }
  }