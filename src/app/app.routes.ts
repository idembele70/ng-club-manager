import { Routes } from '@angular/router';
import { CLUB_ROUTES } from './features/club/club.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'club/dashboard',
  },
  {
    path: 'club',
    ...CLUB_ROUTES,
  }
];
