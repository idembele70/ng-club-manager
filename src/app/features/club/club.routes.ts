import { Route } from "@angular/router";
import { authGuard } from "../../core/guards/auth-guard";
import { guestGuard } from "../../core/guards/guest-guard";
import { ClubDashboard } from "./pages/club-dashboard/club-dashboard.component";
import { ClubLoginComponent } from "./pages/club-login/club-login.component";
import { CreateClubComponent } from "./pages/create-club/create-club.component";

export const CLUB_ROUTES: Route =
{
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'create',
    },
    {
      path: 'dashboard',
      component: ClubDashboard,
      canActivate: [authGuard]
    },
    {
      path: 'create',
      component: CreateClubComponent,
      canActivate: [guestGuard]
    },
    {
      path: 'login',
      component: ClubLoginComponent,
      canActivate: [guestGuard]
    }
  ]
};
