import { Club } from "@/shared/models/club.model";
import { Manager } from "@/features/dashboard/models/manager.model";
import { ClubRepositoryService } from "@/features/dashboard/repositories/club.repository";
import { ManagerRepositoryService } from "@/features/dashboard/repositories/manager.repository";
import { inject, Injectable } from "@angular/core";
import crypto from 'crypto-js';
import { environment } from "src/environments/environment";
import * as uuid from 'uuid';
import { JwtUtilities } from "../utilities/jwt.utilities";
import { AuthSession, LoginPayload, RegisterPayload, Token } from "./auth.model";


@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryService {
  private readonly managerRepository = inject(ManagerRepositoryService);
  private readonly clubRepository = inject(ClubRepositoryService);
  private readonly CRYPTO_SECRET_KEY = environment.CRYPTO_SECRET_KEY;
  
  register(payload: RegisterPayload): Club {
    const clubId = uuid.v1();
    const newManager: Manager = {
      id: uuid.v4(),
      clubId,
      name: payload.managerName,
      createdAt: Date.now()
    };
    this.managerRepository.create(newManager);
    const newClub: Club = {
      id: clubId,
      name: payload.clubName,
      managerId: newManager.id,
      passwordEncrypted: this.encryptPassword(payload.password),
      balance: 700_000_000,
      createdAt: Date.now(),
      abbreviation: payload.clubName.slice(0,4),
    };
    this.clubRepository.create(newClub);
    return newClub;
  }

  login(payload: LoginPayload): AuthSession | undefined {
    const manager = this.managerRepository.findByName(payload.managerOrClubName);
    let club: Club | undefined = undefined;

    if (manager?.clubId) {
      club = this.clubRepository.findById(manager.clubId);
    } else {
      club = this.clubRepository.findByName(payload.managerOrClubName);
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

  isTokenValid(token?: string): boolean {
    if (!token) return false;

    const decode = JwtUtilities.decode(token, this.CRYPTO_SECRET_KEY);
    return decode.exp > Date.now();
  }

  decodeToken(token: string): Token {
    return JwtUtilities.decode(token, environment.CRYPTO_SECRET_KEY);
  }

  private encryptPassword(password: RegisterPayload['password']): string {
    const passwordEncrypted = crypto.AES.encrypt(password, this.CRYPTO_SECRET_KEY);
    return passwordEncrypted.toString();
  }

  private passwordMatch(encryptedPassword: Club['passwordEncrypted'], payloadPassword: string): boolean {
    const passwordBytes = crypto.AES.decrypt(encryptedPassword, this.CRYPTO_SECRET_KEY);
    const originalPassword = passwordBytes.toString(crypto.enc.Utf8);
    return originalPassword === payloadPassword;
  }
}