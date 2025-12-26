import { StorageService } from '@/core/services/storage.service';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Manager } from '../models/manager.model';

@Injectable({
  providedIn: 'root',

})
export class ManagerRepositoryService {
  private readonly _STORAGE_KEY = 'NG_CLUB_MANAGER_MANAGERS';
  private readonly storageService = inject<StorageService<Manager[]>>(StorageService);
  private readonly _managers = signal<Manager[]>(
    this.storageService.getValue(this._STORAGE_KEY) ?? []
  );
  readonly managers = this._managers.asReadonly();

  constructor() {
    effect(() => {
      this.storageService.setValue(this._STORAGE_KEY, this._managers());
    });
  }

  create(manager: Manager): Manager {
    this._managers.update(prev => [...prev, manager]);
    return manager;
  }
  
  findByName(managerName: Manager['name']): Manager | undefined {
    return this.managers().find(manager => manager.name === managerName);
  }
}
