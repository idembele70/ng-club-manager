import { AuthSession } from '@/core/auth/auth.model';
import { StorageService } from '@/core/services/storage.service';
import { JwtUtilities } from '@/core/utilities/jwt.utilities';
import { effect, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Club } from '../models/club.model';

@Injectable({
  providedIn: 'root'
})
export class ClubRepositoryService {
  private readonly _STORAGE_KEY = 'NG_CLUB_MANAGER_CLUBS';
  private readonly _storageService = inject<StorageService<Club[]>>(StorageService);
  private readonly _clubs = signal<Club[]>(
    this._storageService.getValue(this._STORAGE_KEY) ?? []
  );
  private readonly CRYPTO_SECRET_KEY = environment.CRYPTO_SECRET_KEY;

  readonly clubs = this._clubs.asReadonly();

  constructor() {
    effect(() => {
      this._storageService.setValue(this._STORAGE_KEY, this._clubs());
    });
  }

  findByToken(token: string): AuthSession | 'TOKEN_EXPIRED' | 'NOT_FOUND' {
    const decode = JwtUtilities.decode(token, this.CRYPTO_SECRET_KEY);
    if (decode.exp < Date.now()) return 'TOKEN_EXPIRED';
    const club = this.findById(decode.clubId);
    if (!club) return 'NOT_FOUND';
    return { club, token };
  }

  findByName(clubName: Club['name']): Club | undefined {
    return this._clubs().find(club => club.name === clubName);
  }

  findById(clubId: Club['id']): Club | undefined {
    return this._clubs().find(club => club.id === clubId);
  };

  create(newClub: Club): void{
    this._clubs.update(prev => [...prev, newClub])
  }
}
