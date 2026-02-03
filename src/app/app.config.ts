import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { provideZard } from '@/shared/core/provider/providezard';
import { EMPTY } from 'rxjs';
import { routes } from './app.routes';
import { AuthService } from './core/auth/services/auth.service';
import { provideCoreHttp } from './core/config/http.config';
import { i18nProviders } from './core/config/i18n.config';
import { JwtService } from './core/services/jwt.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideCoreHttp(),
    ...i18nProviders,
    provideZard(),
    provideAppInitializer(() => {
      return inject(JwtService).getToken() ? inject(AuthService).restoreSession() : EMPTY
    })
  ],
};
