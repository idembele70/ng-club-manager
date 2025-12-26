import { StorageService } from '@/core/services/storage.service';
import { effect, inject, Injectable, signal } from '@angular/core';
import crypto from 'crypto-js';
import * as uuid from 'uuid';
import { Club, ClubAuthSession, ClubLoginPayload, CreateClubPayload } from '../models/club.model';
import { Manager } from '../models/manager.model';
import { JwtUtilities } from '../utilities/jwt.utilities';
import { ManagerRepositoryService } from './manager.repository';

@Injectable({
  providedIn: 'root'
})
export class ClubRepositoryService {
  private readonly _STORAGE_KEY = 'NG_CLUB_MANAGER_CLUBS';
  private readonly _storageService = inject<StorageService<Club[]>>(StorageService);
  private readonly managerRepository = inject(ManagerRepositoryService);
  private readonly _clubs = signal<Club[]>(
    this._storageService.getValue(this._STORAGE_KEY) ?? []
  );
  private readonly CRYPTO_SECRET_KEY = 'MOCK_SECRET_KEY';

  readonly clubs = this._clubs.asReadonly();

  constructor() {
    effect(() => {
      this._storageService.setValue(this._STORAGE_KEY, this._clubs());
    });
  }

  create(payload: CreateClubPayload): Club {
    const clubId = uuid.v1();
    const newManager: Manager = {
      id: uuid.v4(),
      clubId,
      name: payload.managerName,
    };
    this.managerRepository.create(newManager)
    const newClub: Club = {
      id: clubId,
      name: payload.clubName,
      managerId: newManager.id,
      passwordEncrypted: this.encryptPassword(payload.password),
      balance: 100_000,
      createdAt: Date.now(),
    };
    this._clubs.update(prev => [...prev, newClub]);
    return newClub;
  }

  login(payload: ClubLoginPayload): ClubAuthSession | undefined {
    const manager = this.managerRepository.findByName(payload.managerOrClubName);
    let club: Club | undefined = undefined;

    if (manager?.clubId) {
      club = this.findById(manager.clubId);
    } else {
      club = this.findByName(payload.managerOrClubName);
    }

    if (!club) return undefined;

    const isValid = this.passwordMatch(club.passwordEncrypted, payload.password);
    if (!isValid) {
      return undefined;
    }
    const token = JwtUtilities.sign({
      clubId: club.id,
      managerId: club.managerId,
    }, this.CRYPTO_SECRET_KEY);
    return { club, token };
  }

  findByToken(token: string): ClubAuthSession | undefined {
    const decode = JwtUtilities.decode(token, this.CRYPTO_SECRET_KEY);
    if (decode.exp < Date.now()) return undefined;
    const club = this.findById(decode.clubId);
    if (!club) return undefined;
    return { club, token };
  }

  findByName(clubName: Club['name']): Club | undefined {
    return this._clubs().find(club => club.name === clubName);
  }

  findById(clubId: Club['id']): Club | undefined {
    return this._clubs().find(club => club.id === clubId);
  }

  private encryptPassword(password: CreateClubPayload['password']): string {
    const passwordEncrypted = crypto.AES.encrypt(password, this.CRYPTO_SECRET_KEY);
    return passwordEncrypted.toString();
  }

  private passwordMatch(encryptedPassword: Club['passwordEncrypted'], payloadPassword: string): boolean {
    const passwordBytes = crypto.AES.decrypt(encryptedPassword, this.CRYPTO_SECRET_KEY);
    const originalPassword = passwordBytes.toString(crypto.enc.Utf8);
    return originalPassword === payloadPassword;
  }
}
