import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@/core/auth/services/auth.service';

export const guestGuard: CanActivateFn = () => {
  if (inject(AuthService).isLoggedIn()) {
    return inject(Router).createUrlTree(['dashboard']);
  }
  return true;
};
