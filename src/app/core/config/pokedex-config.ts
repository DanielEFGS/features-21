import { InjectionToken } from '@angular/core';

/**
 * Concurrency limit used when fetching Pokemon details in list views.
 *
 * @defaultValue 8
 */
export const POKEDEX_DETAIL_CONCURRENCY = new InjectionToken<number>(
  'POKEDEX_DETAIL_CONCURRENCY',
  {
    providedIn: 'root',
    factory: () => 8
  }
);
