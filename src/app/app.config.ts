import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { provideZard } from '@/shared/core/provider/providezard';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { i18nProviders } from './core/config/i18n.config';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { clubRepositoryInterceptor } from './features/club/interceptors/club-repository.interceptor';
import { managerRepositoryInterceptor } from './features/club/interceptors/manager-repository.interceptor';
import { JwtService } from './core/services/jwt.service';
import { ClubAuthService } from './features/club/services/club-auth.service';
import { EMPTY } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(
      withInterceptors([
        tokenInterceptor,
        errorInterceptor,
        clubRepositoryInterceptor,
        managerRepositoryInterceptor,
      ]),
    ),
    ...i18nProviders,
    provideZard(),
    provideAppInitializer(() => {
      return inject(JwtService).getToken() ? inject(ClubAuthService).restoreSession() : EMPTY
    })
  ],
};
