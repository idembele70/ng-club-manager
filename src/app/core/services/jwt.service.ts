import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private readonly JWT_KEY = 'NG_CLUB_MANAGER_JWT_KEY';
  getToken(): string {
    return localStorage[this.JWT_KEY];
  }

  saveToken(token: string): void {
    localStorage[this.JWT_KEY] = token;
  }

  destroyToken(): void {
    localStorage[this.JWT_KEY] = '';
  }
}
