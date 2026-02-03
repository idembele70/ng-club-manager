import { Player } from '@libs/domain/models/player.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerFilters } from '../models/player-filters.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly http = inject(HttpClient);

  getAll(filters: PlayerFilters): Observable<{ players: Player[], playersCount: number }> {
    let params = new HttpParams;
    Object.entries(filters).forEach(([key, value]) => {
      if (filters !== undefined)
        params = params.set(key, value);
    });
    return this.http.get<{ players: Player[], playersCount: number }>('/players', { params });
  }
}
