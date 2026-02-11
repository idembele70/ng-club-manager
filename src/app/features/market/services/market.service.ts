import { ZardComboboxOption } from '@/shared/components/zard/combobox';
import { LoadingState } from '@/shared/models/loading-state.model';
import { Nationality } from '@/shared/models/nationality.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Player } from '@libs/domain/models/player.model';
import { delay, map, Observable, tap } from 'rxjs';
import { BuyPlayerResponse } from '../models/buy-player-response.model';
import { MarketPlayersResponse } from '../models/market-players-response.model';
import { MarketFilter } from './../models/market-filter.model';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private readonly http = inject(HttpClient);

  private readonly _filters = signal<MarketFilter>({});
  private readonly _playersForSale = signal<Player[]>([]);
  private readonly _canLoadMore = signal<boolean>(false);
  protected readonly _loading = signal<LoadingState>(LoadingState.LOADING_INITIAL);
  protected readonly _isSearching = signal<boolean>(false);

  readonly filters = this._filters.asReadonly();
  readonly playersForSale = this._playersForSale.asReadonly();
  readonly canLoadMore = this._canLoadMore.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isLoading = computed(() =>
    [LoadingState.LOADING_INITIAL, LoadingState.LOADING_MORE].includes(this._loading())
  );
  readonly isSearching = this._isSearching.asReadonly();

  getPlayersForSale(): Observable<MarketPlayersResponse> {
    let params = new HttpParams();
    Object.entries(this._filters()).forEach(([key, value]) => {
      if (value)
        params = params.set(key, value);
    });
    return this.http.get<MarketPlayersResponse>('/markets/players', { params }).pipe(
      tap({
        next: ({ players, playersCount, rating }) => {
          this._playersForSale.update(p => [...p, ...players]);
          this.setCanLoadMore(this.playersForSale().length < playersCount);
          this.setLoading(LoadingState.LOADED);
          this.updateFilters({...this._filters(), minRating: rating.min, maxRating: rating.max });
        },
        error: () => this.setLoading(LoadingState.ERROR),
      })
    );
  }

  getNationalities(): Observable<ZardComboboxOption[]> {
    return this.http.get<Nationality[]>('/nationalities').pipe(
      map(nationalities => 
        nationalities.map(nationality => ({ value: nationality.name, label: nationality.name })
      ))
    );
  }

  buyPlayer(playerId: Player['id']): Observable<BuyPlayerResponse> {
    return this.http.post<BuyPlayerResponse>(`/markets/players/${playerId}/buy`, null);
  }

  updateFilters(filters: MarketFilter): void {
    this._filters.set({ ...this._filters(), ...filters });
  }

  resetPlayerList(): void {
    this._playersForSale.set([]);
  }

  setCanLoadMore(canLoad: boolean): void {
    this._canLoadMore.set(canLoad);
  }

  setLoading(isLoading: LoadingState): void {
    this._loading.set(isLoading);
  }

  setIsSearching(isSearching: boolean): void {
    this._isSearching.set(isSearching);
  }
}
