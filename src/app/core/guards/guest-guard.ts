import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ClubAuthService } from '@/features/club/services/club-auth.service';

export const guestGuard: CanActivateFn = () => {
  if (inject(ClubAuthService).isLoggedIn()) {
    return inject(Router).createUrlTree(['club', 'dashboard']);
  }
  return true;
};
