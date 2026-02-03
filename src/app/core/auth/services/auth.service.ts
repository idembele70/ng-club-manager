import { JwtService } from '@/core/services/jwt.service';
import { Club } from '@/features/club/models/club.model';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthSession } from '../auth.model';
import { LoginPayload } from '@libs/domain/models/login-payload.model';
import { RegisterPayload } from '@libs/domain/models/register-payload.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly jwtService = inject(JwtService);
  private readonly _currentClubAuthSession = signal<AuthSession | undefined>(undefined);

  readonly currentClubSession = this._currentClubAuthSession.asReadonly();
  readonly isLoggedIn = computed(() => this._currentClubAuthSession() !== undefined);

  create(payload: RegisterPayload): Observable<Club> {
    return this.http.post<Club>('/auth/register', payload);
  }

  login(payload: LoginPayload): Observable<AuthSession> {
    return this.http.post<AuthSession>('/auth/login', payload)
      .pipe(
        tap((authSession) => {
          this._currentClubAuthSession.set(authSession);
          this.jwtService.saveToken(authSession.token);
        }),
      );
  }

  restoreSession(): Observable<AuthSession> {
    return this.http.get<AuthSession>('/clubs/me')
      .pipe(
        tap({
          next: (authSession) => this.setAuth(authSession),
          error: () => this.logout(),
        })
      );
  }

  setAuth(authSession: AuthSession) {
    this._currentClubAuthSession.set(authSession);
    this.jwtService.saveToken(authSession.token);
  }

  logout() {
    this.jwtService.destroyToken();
    this._currentClubAuthSession.set(undefined);
  }
}
