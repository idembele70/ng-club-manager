import { JwtService } from '@/core/services/jwt.service';
import { Club, ClubAuthSession } from '@/features/club/models/club.model';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ClubLoginPayload, CreateClubPayload } from '../models/club.model';

@Injectable({
  providedIn: 'root',
})
export class ClubAuthService {
  private readonly http = inject(HttpClient);
  private readonly jwtService = inject(JwtService);
  private readonly _currentClubAuthSession = signal<ClubAuthSession | undefined>(undefined);

  readonly currentClubSession = this._currentClubAuthSession.asReadonly();
  readonly isLoggedIn = computed(() => this._currentClubAuthSession() !== undefined);

  constructor() {
    this.restoreSession();
  }

  create(payload: CreateClubPayload): Observable<Club> {
    return this.http.post<Club>('/clubs/auth/register', payload);
  }

  login(payload: ClubLoginPayload): Observable<ClubAuthSession> {
    return this.http.post<ClubAuthSession>('/clubs/auth/login', payload)
      .pipe(
        tap((clubAuthSession) => {
          this._currentClubAuthSession.set(clubAuthSession);
          this.jwtService.saveToken(clubAuthSession.token);
        }),
      );
  }

  private restoreSession(): void {
    const token = this.jwtService.getToken();
    if (!token) return;
    this.http.get<ClubAuthSession>('/clubs/me')
      .subscribe({
        next: (clubAuthSession) => this.setAuth(clubAuthSession),
        error: () => this.logout(),
      });
  }

  private setAuth(clubAuthSession: ClubAuthSession) {
    this._currentClubAuthSession.set(clubAuthSession);
    this.jwtService.saveToken(clubAuthSession.token);
  }

  private logout() {
    this.jwtService.destroyToken();
    this._currentClubAuthSession.set(undefined);
  }
}
