import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private readonly _isAuthenticating = signal<boolean>(false);

  readonly isAuthenticating = this._isAuthenticating.asReadonly();

  setIsAuthenticating(state: boolean): void {
    this._isAuthenticating.set(state);
  }
}
