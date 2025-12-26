import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideZard } from '@/shared/core/provider/providezard';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { i18nProviders } from './core/config/i18n.config';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { clubRepositoryInterceptor } from './features/club/interceptors/club-repository.interceptor';
import { managerRepositoryInterceptor } from './features/club/interceptors/manager-repository.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
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
  ],
};
