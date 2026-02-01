import { StorageService } from '@/core/services/storage.service';
import { Player } from '@/features/market/models/player.model';
import { effect, inject, Injectable, signal } from '@angular/core';
import { createPlayer } from '../factories/player.factory';

@Injectable({
  providedIn: 'root',
})
export class PlayerRepository {
  private readonly _STORAGE_KEY = 'NG_CLUB_MANAGER_PLAYER_LIST';
  private readonly _storageService = inject<StorageService<Player[]>>(StorageService);
  private readonly _playerList = signal<Player[]>(
    this._storageService.getValue(this._STORAGE_KEY) ?? Array.from({ length: 2000 }, createPlayer)
  );

  readonly playerList = this._playerList.asReadonly();

  constructor() {
    effect(() => {
      this._storageService.setValue(this._STORAGE_KEY, this._playerList());
    });
  }

  findById(id: string): Player | undefined {
    return this._playerList().find(player => player.id === id);
  }

  update(player: Partial<Player>): void {
    this._playerList.update(prevList => prevList.map(p =>
      p.id === player.id ? { ...p, ...player } : p
    ));
  }
}
