import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/components/login.component';
import { RegisterComponent } from './core/auth/components/register.component';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: '',
    loadComponent: () => import('@/core/layouts/guest-layout.component'),
    canActivate: [guestGuard],
    children: [
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('@/core/layouts/authenticated-layout.component'),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('@/features/club/pages/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        canActivate: [authGuard],
      },
      {
        path: 'market',
        loadComponent: () => import('@/features/market/pages/market.component')
          .then(m => m.MarketComponent)
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];
