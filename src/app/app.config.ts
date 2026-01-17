import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import {
  provideStoreDevtools,
  StoreDevtoolsModule,
} from '@ngrx/store-devtools';
import * as fromApp from './app.reducer';
import { AuthEffects } from './auth/auth.effects';
import { authInterceptor } from './auth/auth.interceptor';

// Application configuration
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(fromApp.reducers),
    provideEffects([AuthEffects]),
    isDevMode()
      ? provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
      : [],
    provideRouterStore(),
    importProvidersFrom([
      StoreDevtoolsModule.instrument({ maxAge: 25 }),
    ]),
  ],
};
