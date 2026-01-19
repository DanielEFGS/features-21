import { TestBed } from '@angular/core/testing';

import { POKEDEX_DETAIL_CONCURRENCY } from './pokedex-config';

describe('POKEDEX_DETAIL_CONCURRENCY', () => {
  it('provides the default concurrency', () => {
    TestBed.configureTestingModule({});

    expect(TestBed.inject(POKEDEX_DETAIL_CONCURRENCY)).toBe(8);
  });
});
