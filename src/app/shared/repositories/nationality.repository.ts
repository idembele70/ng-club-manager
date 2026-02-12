import { StorageService } from '@/core/services/storage.service';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Nationality } from '../models/nationality.model';
import { NATIONALITY_LIST } from '../constants/nationality.constant';
import { matchesFilter } from '../utils/filter.utils';

@Injectable({
  providedIn: 'root',
})
export class NationalityRepository {
  private readonly _STORAGE_KEY = 'NG_CLUB_MANAGER_NATIONALITY_LIST';
  private readonly _storageService = inject<StorageService<Nationality[]>>(StorageService);
  private readonly _nationalityList = signal<Nationality[]>(
    this._storageService.getValue(this._STORAGE_KEY) ?? NATIONALITY_LIST
  );

  constructor() {
    effect(() => {
      this._storageService.setValue(this._STORAGE_KEY, this._nationalityList());
    });
  }

  find<T extends Record<string, string>>(filters: T): Nationality[] {
    return this._nationalityList().filter(n => matchesFilter(n, filters));
  }
}
