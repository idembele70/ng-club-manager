import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BuyPlayerResponse } from '../models/buy-player-response.model';
import { MarketFilter } from '../models/market-filter.model';
import { Player } from '@libs/domain/models/player.model';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private readonly http = inject(HttpClient);
  
  getPlayersForSale(filter?: MarketFilter): Observable<{ players: Player[], playersCount: number }> {
    const params = new HttpParams({ fromObject: filter as Record<string, string> });
    return this.http.get<{ players: Player[], playersCount: number }>('/markets/players', { params });
  }

  buyPlayer(playerId: Player['id']): Observable<BuyPlayerResponse> {
    return this.http.post<BuyPlayerResponse>(`/markets/players/${playerId}/buy`, null);
  }
}
  