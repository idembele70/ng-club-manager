import { StorageService } from '@/core/services/storage.service';
import { Player } from '@libs/domain/models/player.model';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { createRandomPlayer } from '@/features/market/factories/player.factory';

@Injectable({
  providedIn: 'root',
})
export class PlayerRepository {
  private readonly _STORAGE_KEY = 'NG_CLUB_MANAGER_PLAYER_LIST';
  private readonly _storageService = inject<StorageService<Player[]>>(StorageService);
  private readonly _playerList = signal<Player[]>(
    this._storageService.getValue(this._STORAGE_KEY) ?? Array.from({ length: 2000 }, createRandomPlayer)
  );

  readonly marketPlayerList = computed(() =>
    this._playerList().filter(p => !p.clubId)
  )
  readonly currentClubPlayerList = computed<Player[]>(() =>
    this._playerList().filter(p => p.clubId)
  );

  constructor() {
    effect(() => {
      this._storageService.setValue(this._STORAGE_KEY, this._playerList());
    });
  }

  findById(id: string): Player | undefined {
    return this._playerList().find(player => player.id === id);
  }

  find<T extends readonly (keyof Player)[]>(
    filter: { [P in T[number]]?: Player[P] }
  ): Player[] {
    return this._playerList().filter(player =>
      (Object.entries(filter) as [keyof Player, Player[keyof Player]][])
        .every(([key, value]) => player[key] === value)
    );
  }

  update(player: Partial<Player>): void {
    this._playerList.update(prevList => prevList.map(p =>
      p.id === player.id ? { ...p, ...player } : p
    ));
  }
}
