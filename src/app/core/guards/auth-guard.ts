import { ClubAuthService } from '@/features/club/services/club-auth.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  if (inject(ClubAuthService).isLoggedIn()) {
    return true;
  }
  return inject(Router).createUrlTree(['club', 'login']);
};
