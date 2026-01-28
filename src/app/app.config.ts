import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

registerLocaleData(localeEs);
registerLocaleData(localeEn);

export const appConfig: ApplicationConfig = {
  providers: [
    // Default to Spanish; header switcher can reload the app with a different locale.
    { provide: LOCALE_ID, useValue: 'es' },
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay())
  ]
};
